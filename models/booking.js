// models/booking.js
// ---------------------------------------------------------------------------
// One document per reservation. Bookings live in their OWN collection; nothing
// about them is stored inside the Listing document.
//
// WHICH BOOKINGS BLOCK DATES
//   confirmed  -> blocks its nights
//   pending    -> does NOT block (checkout not paid yet)
//   cancelled  -> does NOT block
//   completed  -> historical only
// Availability for a listing is therefore always derived from
//   Booking.find({ listing, status: "confirmed" })
//
// DOUBLE-BOOKING GUARD (works on a standalone MongoDB, no transactions)
//   Every booking carries `stayNights`, the list of nights it occupies,
//   derived automatically from checkIn / checkOut, e.g. 8 Oct -> 10 Oct gives
//   ["2026-10-08", "2026-10-09"].
//   A UNIQUE, PARTIAL index on { listing, stayNights } that only covers
//   status "confirmed" documents lets MongoDB itself refuse a second confirmed
//   booking that shares a night with an existing one for the same listing.
//   That holds even if two requests arrive at the same instant, which an
//   "is it free? then save" check in application code cannot guarantee.
//   `stayNights` is a concurrency key only. Availability is still read from
//   checkIn / checkOut.
//
//   Your future payment code just does:
//       booking.paymentStatus = "paid";
//       booking.paymentId = <gateway payment id>;
//       booking.status = "confirmed";
//       await booking.save();
//   and this model throws if the dates are no longer free
//   (see isDoubleBookingError in utils/booking.js).
// ---------------------------------------------------------------------------

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { listStayNights, DateConflictError } = require("../utils/booking.js");

const bookingSchema = new Schema(
    {
        listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
        guest: { type: Schema.Types.ObjectId, ref: "User", required: true },
        host: { type: Schema.Types.ObjectId, ref: "User", required: true },

        // Stored at 00:00 UTC. Interval is [checkIn, checkOut).
        checkIn: { type: Date, required: true },
        checkOut: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return !this.checkIn || value > this.checkIn;
                },
                message: "Check-out must be after check-in.",
            },
        },

        guests: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true, min: 1 },

        // Price snapshot, calculated by the server at booking time
        currency: { type: String, default: "INR" },
        pricePerNight: { type: Number, required: true, min: 0 },
        subtotal: { type: Number, required: true, min: 0 },
        taxes: { type: Number, required: true, min: 0 },
        serviceFee: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },

        // Payment fields exist for the future gateway integration.
        // Nothing in the app sets them to anything but the defaults yet.
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        paymentId: { type: String, default: null },

        // Copy of what the guest saw when booking, so the booking history still
        // makes sense if the host later edits or deletes the listing.
        listingSnapshot: {
            title: String,
            imageUrl: String,
            location: String,
            state: String,
            checkInTime: String,
            checkOutTime: String,
            cancellationPolicy: String,
        },

        // Derived from checkIn / checkOut. See the note at the top of the file.
        stayNights: { type: [String], default: [] },
    },
    { timestamps: true }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

// Fast availability lookups: "confirmed bookings for this listing near these dates"
bookingSchema.index({ listing: 1, status: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, createdAt: -1 });
bookingSchema.index({ host: 1, createdAt: -1 });

// The double-booking guard (see top of file).
bookingSchema.index(
    { listing: 1, stayNights: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "confirmed" },
        name: "one_confirmed_booking_per_listing_night",
    }
);

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------

// Human-friendly reference, e.g. "ATTH5F3A9C21"
bookingSchema.virtual("bookingRef").get(function () {
    return "ATTH" + String(this._id).slice(-8).toUpperCase();
});

// Payment gateways such as Razorpay want the amount as an integer in paise.
bookingSchema.virtual("amountInPaise").get(function () {
    return Math.round(this.totalPrice * 100);
});

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

// Keep stayNights in sync with the dates (also covers future rescheduling).
bookingSchema.pre("validate", async function () {
    if (
        this.checkIn &&
        this.checkOut &&
        this.checkOut > this.checkIn &&
        (this.isNew || this.isModified("checkIn") || this.isModified("checkOut") || this.stayNights.length === 0)
    ) {
        this.stayNights = listStayNights(this.checkIn, this.checkOut);
    }
});

// Friendly first line of defence when a booking becomes "confirmed".
// The unique index above is the atomic backstop for concurrent requests.
bookingSchema.pre("save", async function () {
    if (this.status !== "confirmed") return;
    if (!this.isNew && !this.isModified("status") && !this.isModified("checkIn") && !this.isModified("checkOut")) return;

    const clash = await this.constructor.exists({
        _id: { $ne: this._id },
        listing: this.listing,
        status: "confirmed",
        checkIn: { $lt: this.checkOut },
        checkOut: { $gt: this.checkIn },
    });
    if (clash) throw new DateConflictError();
});

// ---------------------------------------------------------------------------
// Statics (availability queries)
// ---------------------------------------------------------------------------

// Is there a CONFIRMED booking that overlaps [checkIn, checkOut)?
//   existing.checkIn < requested.checkOut  AND  existing.checkOut > requested.checkIn
// `excludeId` lets a booking ignore itself.
bookingSchema.statics.hasConfirmedOverlap = async function (listingId, checkIn, checkOut, excludeId) {
    const query = {
        listing: listingId,
        status: "confirmed",
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
    };
    if (excludeId) query._id = { $ne: excludeId };
    return Boolean(await this.exists(query));
};

// Confirmed ranges that have not ended yet. Only dates come back, nothing private.
bookingSchema.statics.confirmedRanges = function (listingId, fromDate) {
    return this.find({
        listing: listingId,
        status: "confirmed",
        checkOut: { $gt: fromDate },
    })
        .select("checkIn checkOut -_id")
        .sort({ checkIn: 1 })
        .lean();
};

module.exports = mongoose.model("Booking", bookingSchema);
