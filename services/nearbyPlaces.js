/**
 * services/nearbyPlaces.js
 *
 * "Nearby Popular Places" feature service.
 *
 * Geoapify Places API is the ONLY external data source used here.
 * (This replaces a short-lived Foursquare-based version of this same
 * feature. Foursquare's Service Key ran out of API credits on this
 * project's account, so the feature has been moved back to Geoapify —
 * which Atithi already uses elsewhere for the listing map / reverse
 * geocoding flow in controller/listing.js's new_listing/reverse_geo.
 * This file reuses that SAME existing GEOAPIFY_API_KEY env var; no new
 * key or billing account is required.)
 *
 * ---------------------------------------------------------------------
 * VERIFIED AGAINST CURRENT GEOAPIFY DOCS (checked before writing this):
 * https://apidocs.geoapify.com/docs/places/
 * ---------------------------------------------------------------------
 * - Endpoint:  GET https://api.geoapify.com/v2/places
 * - Auth: apiKey query parameter (no header needed)
 * - Required params: apiKey, categories, and at least one of
 *   filter/bias for the search area.
 * - We use `filter=circle:lon,lat,radiusMeters` (hard radius boundary)
 *   combined with `bias=proximity:lon,lat` (orders results by distance
 *   from that point) — both explicitly documented and meant to be used
 *   together.
 * - Response is a GeoJSON FeatureCollection; each feature's properties
 *   are exactly: name, country, state, postcode, city, street,
 *   housenumber, lat, lon, formatted, address_line1, address_line2,
 *   categories, distance, place_id.
 * - IMPORTANT: there is NO rating, review count, popularity, or
 *   website field anywhere in that list. Geoapify's Places API is
 *   OSM-based and simply does not carry that kind of data. This is
 *   not a plan/tier limitation like Foursquare's Premium fields — it
 *   genuinely does not exist on this endpoint. So `rating` and
 *   `popularity` on every normalized place from this service are
 *   always `null`, and the UI's "⭐"/"🔥 Popular" lines will never
 *   render for Geoapify-sourced places. That is correct behavior
 *   (never fabricate), not a bug.
 * - Category keys below are copied verbatim from Geoapify's own
 *   "Supported categories" table (Catering, Commercial, Tourism,
 *   Entertainment, Leisure, Natural, Beach, Heritage, Religion
 *   sections) — nothing here is guessed or inferred.
 */

// ---------------------------------------------------------------------
// CENTRALIZED CATEGORIES (verbatim from Geoapify's supported-categories docs)
// ---------------------------------------------------------------------

// "catering" (restaurants, cafes, bars, fast food, food court, pub,
// biergarten, ice cream, taproom — all its subcategories included)
// plus bakeries, which live under the separate "commercial" branch.
// "catering" covers restaurants, cafes, bars, fast food, food court,
// pub, biergarten, ice cream, taproom — and every subcategory under
// each of those (catering.restaurant.italian, catering.cafe.coffee,
// etc.). Bakeries were deliberately removed: they kept crowding out
// actual restaurants/cafes in areas where OSM has many more small
// bakery/sweet-shop points than sit-down eateries.
const FOOD_CATEGORIES = ["catering"];

// Tourist attractions/sights (forts, temples, viewpoints, monuments,
// castles, memorials, places of worship tagged as sights, etc.),
// museums/zoos/aquariums/theme parks/cultural venues, parks, natural
// scenery, beaches, UNESCO heritage, and places of worship in general
// (covers active local temples/mosques/churches that may not be
// tagged as tourism sights but are still meaningful for a traveller).
const TRAVEL_CATEGORIES = [
    "tourism",
    "entertainment.museum",
    "entertainment.zoo",
    "entertainment.aquarium",
    "entertainment.theme_park",
    "entertainment.culture",
    "leisure.park",
    "natural",
    "beach",
    "heritage",
    "religion.place_of_worship",
];

// ---------------------------------------------------------------------
// CONFIG (env-overridable, sensible defaults)
// ---------------------------------------------------------------------

const CONFIG = {
    apiKey: process.env.GEOAPIFY_API_KEY,
    apiBaseUrl: "https://api.geoapify.com/v2/places",

    food: {
        categories: FOOD_CATEGORIES,
        radiusMeters: Number(process.env.NEARBY_FOOD_RADIUS_METERS) || 10000,
        limit: Number(process.env.NEARBY_FOOD_LIMIT) || 8,
    },

    travel: {
        categories: TRAVEL_CATEGORIES,
        radiusMeters: Number(process.env.NEARBY_TRAVEL_RADIUS_METERS) || 25000,
        limit: Number(process.env.NEARBY_TRAVEL_LIMIT) || 8,
    },

    cacheTtlMs: Number(process.env.NEARBY_CACHE_TTL_MS) || 6 * 60 * 60 * 1000,
    requestTimeoutMs: Number(process.env.NEARBY_REQUEST_TIMEOUT_MS) || 8000,

    cacheCoordPrecision: 4,

    // Request a bit more than we display so radius-filtering and
    // de-duplication don't starve the final list.
    maxApiLimit: 40,
};

// UI badge thresholds — real signals only. With Geoapify these will
// never fire today (no rating/popularity field exists), but the logic
// is kept so a future data source plugged into this same normalized
// shape can light them up without any other code changing.
const POPULAR_BADGE_MIN_POPULARITY = 0.6;
const HIGHLY_RATED_BADGE_MIN_RATING_5 = 4.5;

// ---------------------------------------------------------------------
// IN-MEMORY CACHE
// ---------------------------------------------------------------------

const cache = new Map();

function buildCacheKey(type, latitude, longitude) {
    const lat = latitude.toFixed(CONFIG.cacheCoordPrecision);
    const lon = longitude.toFixed(CONFIG.cacheCoordPrecision);
    return `nearby:${type}:${lat}:${lon}`;
}

function getCachedNearbyPlaces(cacheKey) {
    const entry = cache.get(cacheKey);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CONFIG.cacheTtlMs) {
        cache.delete(cacheKey);
        return null;
    }
    return entry.data;
}

function setCachedNearbyPlaces(cacheKey, data) {
    cache.set(cacheKey, { data, timestamp: Date.now() });
}

// ---------------------------------------------------------------------
// DISTANCE (Haversine — our own deterministic backend calculation)
// ---------------------------------------------------------------------

function toRadians(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * calculateDistance(lat1, lon1, lat2, lon2)
 * Returns the great-circle distance in KILOMETERS, rounded to 1 decimal.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

function formatDistanceLabel(distanceKm) {
    if (typeof distanceKm !== "number" || !Number.isFinite(distanceKm)) {
        return undefined;
    }
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
}

// ---------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------

function getValidatedCoordinates(listing) {
    const rawLat = listing && listing.coordinates && listing.coordinates.latitude;
    const rawLon = listing && listing.coordinates && listing.coordinates.longitude;

    const latitude = Number(rawLat);
    const longitude = Number(rawLon);

    const valid =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;

    return valid ? { latitude, longitude } : null;
}

// ---------------------------------------------------------------------
// NORMALIZATION
// ---------------------------------------------------------------------

/**
 * normalizePlace(feature, originLat, originLon)
 * Converts one Geoapify GeoJSON feature into our internal, safe shape.
 * Returns null if the place has no usable name.
 */
function normalizePlace(feature, originLat, originLon) {
    const props = (feature && feature.properties) || {};

    const name = props.name || props.address_line1;
    if (!name) return null; // nothing meaningful to show a traveller

    const latitude = typeof props.lat === "number" ? props.lat : undefined;
    const longitude = typeof props.lon === "number" ? props.lon : undefined;

    // Our own deterministic backend calculation from the listing's
    // saved coordinates to this place's coordinates.
    let distanceKm;
    if (typeof latitude === "number" && typeof longitude === "number") {
        distanceKm = calculateDistance(originLat, originLon, latitude, longitude);
    } else if (typeof props.distance === "number") {
        // Fall back to Geoapify's own distance (meters) only if we
        // somehow don't have coordinates to compute it ourselves.
        distanceKm = Math.round((props.distance / 1000) * 10) / 10;
    }

    const categories = Array.isArray(props.categories) ? props.categories : [];
    // Categories are returned generic-to-specific (e.g. "catering",
    // "catering.restaurant", "catering.restaurant.italian"); show the
    // most specific one, prettified.
    const mostSpecific = categories.length > 0 ? categories[categories.length - 1] : null;
    const category = mostSpecific
        ? mostSpecific.split(".").pop().replace(/_/g, " ")
        : null;

    return {
        id: props.place_id || null,
        name,
        category,
        categories,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        address: props.formatted || props.address_line1 || null,
        locality: props.city || null,
        region: props.state || null,
        country: props.country || null,
        // Geoapify's Places API does not return a website field.
        website: null,
        // Geoapify's Places API does not return rating or popularity
        // at all (see header comment) — always null, never invented.
        rating: null,
        popularity: null,
        distanceKm: typeof distanceKm === "number" ? distanceKm : null,
        distanceLabel: formatDistanceLabel(distanceKm),
        // No website to link to, and no public "Geoapify place page"
        // exists to fall back to, so this stays null. The view falls
        // back to a plain map link built from our own validated
        // coordinates when this is null.
        placeUrl: null,
        source: "geoapify",
    };
}

// ---------------------------------------------------------------------
// RADIUS FILTER (belt-and-suspenders re-check in our own backend)
// ---------------------------------------------------------------------

function filterWithinRadius(places, radiusMeters) {
    const radiusKm = radiusMeters / 1000;
    return places.filter((place) => {
        if (typeof place.distanceKm !== "number") return true; // can't check, don't punish
        return place.distanceKm <= radiusKm;
    });
}

// ---------------------------------------------------------------------
// DEDUPLICATION
// ---------------------------------------------------------------------

function normalizeNameKey(name) {
    return (name || "")
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
}

function deduplicatePlaces(places) {
    const seen = new Set();
    const result = [];

    for (const place of places) {
        let key;

        if (place.id) {
            key = `id:${place.id}`;
        } else if (typeof place.latitude === "number" && typeof place.longitude === "number") {
            key = `geo:${normalizeNameKey(place.name)}:${place.latitude.toFixed(3)}:${place.longitude.toFixed(3)}`;
        } else {
            key = `name:${normalizeNameKey(place.name)}`;
        }

        if (seen.has(key)) continue;
        seen.add(key);
        result.push(place);
    }

    return result;
}

// ---------------------------------------------------------------------
// RANKING
//
// Geoapify's `bias=proximity` ordering (closest-first) is the primary
// signal here, since no rating/popularity data exists on this
// endpoint. We nudge that only by a light category-relevance weight so
// a genuine attraction/restaurant outranks a very generic/minor match,
// without ever treating a missing rating/popularity as 0.
// ---------------------------------------------------------------------

const CATEGORY_RELEVANCE_WEIGHT = {
    "tourism.attraction": 1.0,
    "tourism.sights": 0.95,
    heritage: 0.95,
    "entertainment.museum": 0.9,
    beach: 0.9,
    "catering.restaurant": 0.85,
    "religion.place_of_worship": 0.8,
    "leisure.park": 0.75,
    "catering.cafe": 0.7,
    natural: 0.7,
    "catering.fast_food": 0.55,
};
const DEFAULT_CATEGORY_WEIGHT = 0.65;

function categoryRelevance(place) {
    // Look for the most specific category we have a weight for.
    for (let i = place.categories.length - 1; i >= 0; i--) {
        if (CATEGORY_RELEVANCE_WEIGHT[place.categories[i]] !== undefined) {
            return CATEGORY_RELEVANCE_WEIGHT[place.categories[i]];
        }
    }
    return DEFAULT_CATEGORY_WEIGHT;
}

function rankPlaces(places, radiusMeters) {
    const total = places.length;

    const scored = places.map((place, index) => {
        // Geoapify already returned these ordered by proximity bias;
        // preserve that as our baseline "API rank" signal.
        const apiRankScore = total > 1 ? 1 - index / (total - 1) : 1;

        const hasPopularity = typeof place.popularity === "number";
        const hasRating = typeof place.rating === "number";

        let score;
        let badge = null;

        if (hasPopularity || hasRating) {
            // Kept for forward-compatibility with a future data source;
            // never actually reached with Geoapify today.
            const popularityScore = hasPopularity ? place.popularity : apiRankScore;
            const ratingScore = hasRating ? place.rating / 5 : apiRankScore;
            const distanceScore =
                typeof place.distanceKm === "number"
                    ? Math.max(0, 1 - (place.distanceKm * 1000) / radiusMeters)
                    : apiRankScore;

            score = popularityScore * 0.45 + ratingScore * 0.3 + distanceScore * 0.25;

            if (hasPopularity && place.popularity >= POPULAR_BADGE_MIN_POPULARITY) {
                badge = "Popular";
            } else if (hasRating && place.rating >= HIGHLY_RATED_BADGE_MIN_RATING_5) {
                badge = "Highly Rated";
            }
        } else {
            // No rating/popularity available (the normal Geoapify case):
            // blend proximity with category relevance instead of
            // treating the missing signals as 0.
            const distanceScore =
                typeof place.distanceKm === "number"
                    ? Math.max(0, 1 - (place.distanceKm * 1000) / radiusMeters)
                    : apiRankScore;

            score = distanceScore * 0.6 + categoryRelevance(place) * 0.4;
        }

        return { ...place, badge, __score: score };
    });

    return scored
        .sort((a, b) => b.__score - a.__score)
        .map(({ __score, ...place }) => place);
}

// ---------------------------------------------------------------------
// GEOAPIFY HTTP CALL
// ---------------------------------------------------------------------

function buildSearchUrl({ latitude, longitude, categories, radiusMeters, limit }) {
    const params = new URLSearchParams({
        categories: categories.join(","),
        filter: `circle:${longitude},${latitude},${radiusMeters}`,
        bias: `proximity:${longitude},${latitude}`,
        limit: String(Math.min(limit, CONFIG.maxApiLimit)),
        apiKey: CONFIG.apiKey,
    });

    return `${CONFIG.apiBaseUrl}?${params.toString()}`;
}

async function callGeoapify(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs);

    try {
        return await fetch(url, {
            method: "GET",
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }
}

/**
 * searchGeoapifyCategory — one Places Search call for one category
 * group (food or travel).
 */
async function searchGeoapifyCategory(type, { latitude, longitude }, categoryConfig) {
    const requestLimit = Math.min(categoryConfig.limit * 3, CONFIG.maxApiLimit);

    console.log(
        `[NearbyPlaces] Searching ${type} near ${latitude.toFixed(3)},${longitude.toFixed(3)}`
    );

    const url = buildSearchUrl({
        latitude,
        longitude,
        categories: categoryConfig.categories,
        radiusMeters: categoryConfig.radiusMeters,
        limit: requestLimit,
    });

    const response = await callGeoapify(url);

    if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        throw new Error(
            `Geoapify request failed: ${response.status} ${bodyText.slice(0, 200)}`
        );
    }

    const data = await response.json();
    const features = Array.isArray(data.features) ? data.features : [];

    console.log(`[NearbyPlaces] Geoapify returned ${features.length} ${type} places`);

    return features
        .map((feature) => normalizePlace(feature, latitude, longitude))
        .filter(Boolean);
}

// ---------------------------------------------------------------------
// PER-CATEGORY PIPELINE (cache -> fetch -> normalize -> filter ->
// dedupe -> rank -> trim -> cache)
// ---------------------------------------------------------------------

async function getNearbyCategoryPlaces(type, coords, categoryConfig) {
    const cacheKey = buildCacheKey(type, coords.latitude, coords.longitude);
    const cached = getCachedNearbyPlaces(cacheKey);

    if (cached) {
        console.log(`[NearbyPlaces] Cache hit (${type})`);
        return cached;
    }

    const rawPlaces = await searchGeoapifyCategory(type, coords, categoryConfig);
    const withinRadius = filterWithinRadius(rawPlaces, categoryConfig.radiusMeters);
    const deduped = deduplicatePlaces(withinRadius);
    const ranked = rankPlaces(deduped, categoryConfig.radiusMeters);
    const trimmed = ranked.slice(0, categoryConfig.limit);

    // Only cache successful outcomes (including a legitimate empty
    // result) — never cache a thrown error.
    setCachedNearbyPlaces(cacheKey, trimmed);

    return trimmed;
}

// ---------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------

/**
 * getNearbyPlaces(listing)
 *
 * Always resolves — never rejects. On any failure, missing key, or
 * missing/invalid coordinates, resolves to { food: [], travel: [] }.
 *
 * @param {Object} listing - Mongoose Listing document (or plain object)
 * @returns {Promise<{food: Array, travel: Array, meta: Object}>}
 */
async function getNearbyPlaces(listing) {
    const empty = {
        food: [],
        travel: [],
        meta: { source: "geoapify", fetchedAt: new Date() },
    };

    const coords = getValidatedCoordinates(listing);
    if (!coords) {
        console.error("[NearbyPlaces] Skipped: listing has no valid coordinates");
        return empty;
    }

    if (!CONFIG.apiKey) {
        console.error("[NearbyPlaces] Skipped: GEOAPIFY_API_KEY is missing");
        return empty;
    }

    const [foodResult, travelResult] = await Promise.allSettled([
        getNearbyCategoryPlaces("food", coords, CONFIG.food),
        getNearbyCategoryPlaces("travel", coords, CONFIG.travel),
    ]);

    if (foodResult.status === "rejected") {
        console.error(
            "[NearbyPlaces] Food search failed:",
            foodResult.reason && foodResult.reason.message
        );
    }

    if (travelResult.status === "rejected") {
        console.error(
            "[NearbyPlaces] Travel search failed:",
            travelResult.reason && travelResult.reason.message
        );
    }

    return {
        food: foodResult.status === "fulfilled" ? foodResult.value : [],
        travel: travelResult.status === "fulfilled" ? travelResult.value : [],
        meta: { source: "geoapify", fetchedAt: new Date() },
    };
}

module.exports = {
    getNearbyPlaces,
    // Exported for potential unit testing / reuse — not required by
    // the controller, which only ever calls getNearbyPlaces().
    calculateDistance,
    normalizePlace,
    rankPlaces,
    deduplicatePlaces,
};