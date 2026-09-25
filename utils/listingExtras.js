// utils/listingExtras.js
// ---------------------------------------------------------------------------
// Amenities + optional property details (maxGuests, bedrooms, ...).
//
//   * One list of allowed amenities, shared by the host form (new / edit),
//     the show page and the server-side whitelist.
//   * splitListingExtras() turns the raw form body into safe values before
//     they reach Mongoose, for both "create" and "update".
//
// app.js exposes this module to every EJS view as `listingExtras`.
// ---------------------------------------------------------------------------

// Stored in MongoDB exactly as written here (human-readable labels).
const AMENITY_GROUPS = [
    {
        title: "Essentials",
        items: ["WiFi", "Kitchen", "Dedicated workspace", "Free parking", "TV", "Hot water"],
    },
    {
        title: "Comfort",
        items: [
            "Air conditioning", "Heating", "Washing machine", "Refrigerator", "Microwave",
            "Iron", "Hair dryer", "Towels", "Bed linen", "Breakfast available",
        ],
    },
    {
        title: "Outdoor",
        items: ["Balcony", "Garden", "Swimming pool", "BBQ", "Outdoor seating"],
    },
    {
        title: "Guests and access",
        items: ["Pets allowed", "Family friendly", "Private entrance"],
    },
    {
        title: "Safety",
        items: ["Smoke alarm", "Carbon monoxide alarm", "Fire extinguisher", "First aid kit", "Security cameras"],
    },
];

const ALL_AMENITIES = AMENITY_GROUPS.flatMap((g) => g.items);

// Font Awesome (already loaded by views/layouts/boilerplate.ejs)
const AMENITY_ICONS = {
    "WiFi": "fa-wifi",
    "Kitchen": "fa-utensils",
    "Dedicated workspace": "fa-laptop",
    "Free parking": "fa-square-parking",
    "TV": "fa-tv",
    "Hot water": "fa-shower",
    "Air conditioning": "fa-snowflake",
    "Heating": "fa-fire",
    "Washing machine": "fa-shirt",
    "Refrigerator": "fa-temperature-low",
    "Microwave": "fa-bowl-food",
    "Iron": "fa-temperature-high",
    "Hair dryer": "fa-wind",
    "Towels": "fa-bath",
    "Bed linen": "fa-bed",
    "Breakfast available": "fa-mug-hot",
    "Balcony": "fa-building",
    "Garden": "fa-seedling",
    "Swimming pool": "fa-person-swimming",
    "BBQ": "fa-drumstick-bite",
    "Outdoor seating": "fa-chair",
    "Pets allowed": "fa-paw",
    "Family friendly": "fa-child",
    "Private entrance": "fa-door-open",
    "Smoke alarm": "fa-bell",
    "Carbon monoxide alarm": "fa-triangle-exclamation",
    "Fire extinguisher": "fa-fire-extinguisher",
    "First aid kit": "fa-kit-medical",
    "Security cameras": "fa-video",
};

function amenityIcon(name) {
    return AMENITY_ICONS[name] || "fa-check";
}

// Descriptions are informational only. No refund logic exists yet.
const CANCELLATION_POLICIES = {
    flexible: { label: "Flexible", description: "Full refund if cancelled at least 24 hours before check-in." },
    moderate: { label: "Moderate", description: "Full refund if cancelled at least 5 days before check-in." },
    strict: { label: "Strict", description: "Full refund if cancelled at least 14 days before check-in." },
};
const CANCELLATION_POLICY_KEYS = Object.keys(CANCELLATION_POLICIES);

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// ---------------------------------------------------------------------------
// Amenities
// ---------------------------------------------------------------------------

// Accepts undefined | "" | "WiFi" | ["", "WiFi", "TV"] and returns a clean
// array: only known amenities, no duplicates, no blanks.
function normalizeAmenities(raw) {
    const list = Array.isArray(raw) ? raw : raw === undefined || raw === null ? [] : [raw];
    const seen = new Set();
    for (const item of list) {
        if (typeof item === "string" && ALL_AMENITIES.includes(item)) seen.add(item);
    }
    return [...seen];
}

// Old listings have no amenities at all, so always be defensive.
// Canonical order first (stable display), unknown legacy values last.
function sortAmenities(list) {
    const arr = Array.isArray(list) ? list.filter((a) => typeof a === "string" && a) : [];
    const known = ALL_AMENITIES.filter((a) => arr.includes(a));
    const other = arr.filter((a) => !ALL_AMENITIES.includes(a));
    return [...known, ...other];
}

// ---------------------------------------------------------------------------
// Optional numeric / time / policy fields
// ---------------------------------------------------------------------------

const NUMERIC_FIELDS = {
    maxGuests: { min: 1, max: 50, step: 1 },
    bedrooms: { min: 0, max: 50, step: 1 },
    beds: { min: 0, max: 100, step: 1 },
    bathrooms: { min: 0, max: 50, step: 0.5 },
};
const TIME_FIELDS = ["checkInTime", "checkOutTime"];
const EXTRA_KEYS = ["amenities", ...Object.keys(NUMERIC_FIELDS), ...TIME_FIELDS, "cancellationPolicy"];

function isBlank(v) {
    return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

// Splits the `listing[...]` form body into:
//   rest  - every field that is NOT one of the optional extras (passed on untouched)
//   set   - validated extras that should be written
//   unset - extras the host cleared (blank) and that should be removed
//
// Rules:
//   * A key that is absent from the form is left alone (old forms keep working).
//   * A blank value means "clear it".
//   * An invalid value (only possible from a tampered request) is ignored.
function splitListingExtras(body) {
    const source = body && typeof body === "object" ? body : {};
    const rest = {};
    for (const key of Object.keys(source)) {
        if (!EXTRA_KEYS.includes(key)) rest[key] = source[key];
    }

    const set = {};
    const unset = {};

    if (source.amenities !== undefined) {
        set.amenities = normalizeAmenities(source.amenities);
    }

    for (const [key, rule] of Object.entries(NUMERIC_FIELDS)) {
        const raw = source[key];
        if (raw === undefined) continue;
        if (isBlank(raw)) { unset[key] = 1; continue; }
        if (typeof raw !== "string" || !/^\d+(\.\d+)?$/.test(raw.trim())) continue;
        const n = Number(raw);
        const onStep = Math.abs(n / rule.step - Math.round(n / rule.step)) < 1e-9;
        if (n >= rule.min && n <= rule.max && onStep) set[key] = n;
    }

    for (const key of TIME_FIELDS) {
        const raw = source[key];
        if (raw === undefined) continue;
        if (isBlank(raw)) { unset[key] = 1; continue; }
        if (typeof raw === "string" && TIME_PATTERN.test(raw.trim())) set[key] = raw.trim();
    }

    if (source.cancellationPolicy !== undefined) {
        const raw = source.cancellationPolicy;
        if (isBlank(raw)) unset.cancellationPolicy = 1;
        else if (typeof raw === "string" && CANCELLATION_POLICY_KEYS.includes(raw)) set.cancellationPolicy = raw;
    }

    return { rest, set, unset };
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

// "14:30" -> "2:30 PM"
function formatTime12(hhmm) {
    if (typeof hhmm !== "string" || !TIME_PATTERN.test(hhmm)) return "";
    const [h, m] = hhmm.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

// ["4 guests", "2 bedrooms", ...] for whatever the host filled in
function listingFacts(listing) {
    const l = listing || {};
    const facts = [];
    const add = (value, word) => {
        if (typeof value === "number" && Number.isFinite(value)) {
            facts.push(`${value} ${word}${value === 1 ? "" : "s"}`);
        }
    };
    add(l.maxGuests, "guest");
    add(l.bedrooms, "bedroom");
    add(l.beds, "bed");
    add(l.bathrooms, "bathroom");
    return facts;
}

module.exports = {
    AMENITY_GROUPS,
    ALL_AMENITIES,
    AMENITY_ICONS,
    CANCELLATION_POLICIES,
    CANCELLATION_POLICY_KEYS,
    NUMERIC_FIELDS,
    TIME_PATTERN,
    amenityIcon,
    normalizeAmenities,
    sortAmenities,
    splitListingExtras,
    formatTime12,
    listingFacts,
};
