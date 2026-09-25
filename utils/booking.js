// utils/booking.js
// ---------------------------------------------------------------------------
// Pure helper functions for the booking feature.
// Nothing in here touches MongoDB or Express, so it is easy to unit-test
// (see test/booking.utils.test.js).
//
// DATE MODEL
//   * A stay is the half-open interval  [checkIn, checkOut).
//     checkIn is inclusive, checkOut is exclusive, so 8 Oct -> 10 Oct occupies
//     the nights of 8 Oct and 9 Oct, and another guest may check in on 10 Oct.
//   * Dates travel between browser and server as "YYYY-MM-DD" strings and are
//     stored in MongoDB as Date values at 00:00:00 UTC. Everything here works
//     in UTC, so there are no daylight-saving or server-timezone surprises.
//   * "Today" is decided in the property's timezone (India), not the server's.
// ---------------------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;

const CONFIG = {
    TIMEZONE: "Asia/Kolkata",     // used to decide what "today" means
    MAX_STAY_NIGHTS: 30,          // upper limit for a single booking
    DEFAULT_MAX_GUESTS: 4,        // used when a listing has no maxGuests (old listings)
    DEFAULT_TAX_RATE: 0.12,       // development defaults, see getTaxRate()
    DEFAULT_SERVICE_FEE_RATE: 0.06,
};

const DATE_CONFLICT_MESSAGE =
    "Sorry, these dates were just booked by another guest. Please select different dates.";

// ---------------------------------------------------------------------------
// Configurable rates
// ---------------------------------------------------------------------------
// TAX_RATE and SERVICE_FEE_RATE are fractions in .env (0.12 means 12%).
// They are APPLICATION-LEVEL CONFIGURATION VALUES for this project. They are
// not necessarily the legally applicable tax rates for every real-world
// booking (GST slabs depend on the tariff, the property type, the state...).
// Check with an accountant before charging real money.

function parseRate(rawValue, fallback, name) {
    if (rawValue === undefined || rawValue === null || String(rawValue).trim() === "") {
        return fallback;
    }
    const n = Number(rawValue);
    if (!Number.isFinite(n) || n < 0 || n > 1) {
        console.warn(`[booking] ${name}="${rawValue}" is not a fraction between 0 and 1. Using ${fallback}.`);
        return fallback;
    }
    return n;
}

function getTaxRate() {
    return parseRate(process.env.TAX_RATE, CONFIG.DEFAULT_TAX_RATE, "TAX_RATE");
}

function getServiceFeeRate() {
    return parseRate(process.env.SERVICE_FEE_RATE, CONFIG.DEFAULT_SERVICE_FEE_RATE, "SERVICE_FEE_RATE");
}

// ---------------------------------------------------------------------------
// Ids
// ---------------------------------------------------------------------------

// Strict 24-hex check. (mongoose.isValidObjectId also accepts any 12-char string.)
function isValidObjectId(id) {
    return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

// "YYYY-MM-DD" -> Date at 00:00 UTC, or null if it is not a real calendar date.
function parseDateString(str) {
    if (typeof str !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    const [y, m, d] = str.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    // Rejects things like 2026-02-30, which JS would silently roll into March.
    return toDateString(date) === str ? date : null;
}

// Date -> "YYYY-MM-DD" (UTC)
function toDateString(date) {
    return new Date(date).toISOString().slice(0, 10);
}

// What is today's date in the property's timezone, as "YYYY-MM-DD"?
function todayString(now = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: CONFIG.TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now);
}

// Today's date as a Date at 00:00 UTC (comparable with stored checkIn/checkOut).
function startOfToday(now = new Date()) {
    return parseDateString(todayString(now));
}

// Validates a check-in / check-out pair coming from the browser.
// Returns { ok:true, checkIn:Date, checkOut:Date, nights:Number }
//      or { ok:false, message:String }
function parseBookingDates(checkInStr, checkOutStr, now = new Date()) {
    const checkIn = parseDateString(checkInStr);
    const checkOut = parseDateString(checkOutStr);

    if (!checkIn || !checkOut) {
        return { ok: false, message: "Please select valid check-in and check-out dates." };
    }
    if (checkIn < startOfToday(now)) {
        return { ok: false, message: "Check-in date cannot be in the past." };
    }
    if (checkOut <= checkIn) {
        return { ok: false, message: "Check-out must be after check-in." };
    }
    const nights = Math.round((checkOut - checkIn) / DAY_MS);
    if (nights > CONFIG.MAX_STAY_NIGHTS) {
        return { ok: false, message: `A single booking can be at most ${CONFIG.MAX_STAY_NIGHTS} nights.` };
    }
    return { ok: true, checkIn, checkOut, nights };
}

// Every night occupied by [checkIn, checkOut) as "YYYY-MM-DD" strings.
// Used by the Booking model as the key for its unique index (see models/booking.js).
function listStayNights(checkIn, checkOut) {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const count = Math.round((end - start) / DAY_MS);
    if (!(count >= 1) || count > 366) {
        throw new Error("Invalid booking range");
    }
    const nights = [];
    for (let i = 0; i < count; i++) {
        nights.push(toDateString(new Date(start + i * DAY_MS)));
    }
    return nights;
}

// Two half-open intervals overlap when
//     a.checkIn < b.checkOut  AND  a.checkOut > b.checkIn
// (the same condition the database query uses)
function rangesOverlap(aIn, aOut, bIn, bOut) {
    return new Date(aIn) < new Date(bOut) && new Date(aOut) > new Date(bIn);
}

// ---------------------------------------------------------------------------
// Guests
// ---------------------------------------------------------------------------

function getMaxGuests(listing) {
    const n = Number(listing && listing.maxGuests);
    return Number.isInteger(n) && n >= 1 ? n : CONFIG.DEFAULT_MAX_GUESTS;
}

// Returns { ok:true, guests:Number } or { ok:false, message }
function parseGuests(raw, maxGuests) {
    if (typeof raw !== "string" && typeof raw !== "number") {
        return { ok: false, message: "Please choose the number of guests." };
    }
    const text = String(raw).trim();
    if (!/^\d+$/.test(text)) {
        return { ok: false, message: "Please choose the number of guests." };
    }
    const guests = Number(text);
    if (guests < 1) {
        return { ok: false, message: "At least 1 guest is required." };
    }
    if (guests > maxGuests) {
        return {
            ok: false,
            message: `This place can host at most ${maxGuests} guest${maxGuests === 1 ? "" : "s"}.`,
        };
    }
    return { ok: true, guests };
}

// ---------------------------------------------------------------------------
// Pricing (the server is the only source of truth)
// ---------------------------------------------------------------------------
// Money is calculated in integer paise to avoid floating-point drift,
// then stored in rupees with two decimals.

function calculatePricing({ pricePerNight, nights, taxRate, serviceFeeRate }) {
    const rateTax = taxRate === undefined ? getTaxRate() : taxRate;
    const rateFee = serviceFeeRate === undefined ? getServiceFeeRate() : serviceFeeRate;

    const nightPaise = Math.round(Number(pricePerNight) * 100);
    if (!Number.isFinite(nightPaise) || nightPaise <= 0) {
        throw new Error("Listing has no valid price");
    }
    if (!Number.isInteger(nights) || nights < 1) {
        throw new Error("Invalid number of nights");
    }

    const subtotalPaise = nightPaise * nights;
    const taxPaise = Math.round(subtotalPaise * rateTax);
    const feePaise = Math.round(subtotalPaise * rateFee);
    const totalPaise = subtotalPaise + taxPaise + feePaise;

    return {
        pricePerNight: nightPaise / 100,
        nights,
        subtotal: subtotalPaise / 100,
        taxes: taxPaise / 100,
        serviceFee: feePaise / 100,
        totalPrice: totalPaise / 100,
    };
}

// ---------------------------------------------------------------------------
// Double-booking error
// ---------------------------------------------------------------------------

// Thrown by the Booking model when a booking that overlaps an already
// confirmed booking is about to be saved as "confirmed".
class DateConflictError extends Error {
    constructor() {
        super(DATE_CONFLICT_MESSAGE);
        this.name = "DateConflictError";
        this.code = "DATE_CONFLICT";
    }
}

// True for both flavours of double booking:
//   * DateConflictError (friendly pre-save check found an overlap)
//   * MongoDB E11000 on the unique night index (two requests raced each other)
function isDoubleBookingError(err) {
    if (!err) return false;
    if (err instanceof DateConflictError || err.code === "DATE_CONFLICT") return true;
    return (
        err.code === 11000 &&
        ((err.keyPattern && "stayNights" in err.keyPattern) || /stayNights/.test(err.message || ""))
    );
}

// ---------------------------------------------------------------------------
// View helpers (exposed to EJS through app.locals.bookingFormat)
// ---------------------------------------------------------------------------

function formatINR(amount) {
    return "\u20B9" + Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Whole rupees when there are no paise (used for "per night" prices)
function formatINRShort(amount) {
    const n = Number(amount || 0);
    return "\u20B9" + n.toLocaleString("en-IN", {
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
    });
}

// Stored dates are UTC midnight, so format them in UTC too.
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

function plural(n, word) {
    return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function capitalize(text) {
    const s = String(text || "");
    return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = {
    DAY_MS,
    CONFIG,
    DATE_CONFLICT_MESSAGE,
    getTaxRate,
    getServiceFeeRate,
    isValidObjectId,
    parseDateString,
    toDateString,
    todayString,
    startOfToday,
    parseBookingDates,
    listStayNights,
    rangesOverlap,
    getMaxGuests,
    parseGuests,
    calculatePricing,
    DateConflictError,
    isDoubleBookingError,
    formatINR,
    formatINRShort,
    formatDate,
    plural,
    capitalize,
};
