// controller/home.js
//
// NEW FILE — powers the redesigned homepage ONLY.
// Reuses the existing Listing model exactly as-is. No schema changes,
// no new routes elsewhere, no changes to listing CRUD logic.

const listing = require("../models/listing.js");

// Short, factual cultural taglines — same pattern already used in
// views/listing/states.ejs, kept local here so states.ejs/list_states
// stay completely untouched.
const STATE_TAGLINES = {
    "Rajasthan": "Havelis • Desert • Royal Heritage",
    "Kerala": "Backwaters • Ayurveda • Coastal Life",
    "Maharashtra": "Forts • Wadas • Konkan Culture",
    "Goa": "Beaches • Heritage • Portuguese Culture",
    "Gujarat": "Havelis • Rann • Heritage",
    "Jammu and Kashmir": "Mountains • Houseboats • Kashmiri Culture",
    "Chhattisgarh": "Tribal Culture • Forests • Waterfalls",
    "Andhra Pradesh": "Heritage • Beaches • Eastern Ghats",
};

module.exports.home = async (req, res) => {
    try {
        const stateNames = Object.keys(STATE_TAGLINES);

        // One representative image + a real listing count per state,
        // pulled straight from existing data — nothing fabricated.
        const stateCardsRaw = await Promise.all(
            stateNames.map(async (name) => {
                const sample = await listing.findOne({ state: name });
                if (!sample) return null;

                const count = await listing.countDocuments({ state: name });

                return {
                    name,
                    tagline: STATE_TAGLINES[name],
                    image: sample.image.url,
                    count,
                };
            })
        );

        const stateCards = stateCardsRaw.filter(Boolean);

        // Most recently added listings, reusing the existing schema.
        const featuredListings = await listing
            .find({})
            .sort({ _id: -1 })
            .limit(6);

        res.render("home.ejs", {
            stateCards,
            featuredListings,
            isHome: true,
        });
    } catch (error) {
        console.error("Homepage load error:", error);

        // Fail-safe: the homepage must still render even if a query
        // fails, same defensive pattern used by nearbyPlaces.js.
        res.render("home.ejs", {
            stateCards: [],
            featuredListings: [],
            isHome: true,
        });
    }
};