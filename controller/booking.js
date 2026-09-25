// controller/booking.js
// ---------------------------------------------------------------------------
// Booking flow:
//   reservation card -> POST /bookings          (create_booking)
//                    -> GET  /bookings/:id/checkout   (checkout_page)
//                    -> POST /bookings/:id/pay        (pay_booking)  <- PAYMENT GATEWAY INTEGRATION POINT
//                    -> GET  /bookings/:id/payment-placeholder
//
// Security rules used everywhere in this file:
//   * the user always comes from req.user, never from the request body
//   * price, nights and totals are always recalculated from the Listing in MongoDB
//   * dates and guests are validated again here, even though the browser checks them
//   * availability is re-checked against the LATEST confirmed bookings
// ---------------------------------------------------------------------------

const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");

const {
    DATE_CONFLICT_MESSAGE,
    isValidObjectId,
    parseBookingDates,
    parseGuests,
    getMaxGuests,
    calculatePricing,
    startOfToday,
    todayString,
    toDateString,
} = require("../utils/booking.js");

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function listing_url(id, params) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return `/listings/${id}${query}`;
}

// Loads a booking for the logged-in user.
//   * guests can always open their own booking
//   * hosts can open bookings made on THEIR listings when allowHost is true
//   * everybody else gets the same "not found" answer, so ids cannot be probed
// Returns the booking, or null after it has already redirected.
async function find_booking(req, res, { allowHost = false } = {}) {
    const { id } = req.params;
    const booking = isValidObjectId(id) ? await Booking.findById(id) : null;

    const isGuest = booking && booking.guest.equals(req.user._id);
    const isHost = booking && allowHost && booking.host.equals(req.user._id);

    if (!booking || (!isGuest && !isHost)) {
        req.flash("error", "Booking not found.");
        res.redirect("/bookings");
        return null;
    }
    return booking;
}

async function find_host_name(booking) {
    const host = await User.findById(booking.host).select("first_name last_name").lean();
    return host ? `${host.first_name} ${host.last_name}`.trim() : null;
}

// Ratings are not part of the code base yet (there is no Review model in this
// project), so the checkout page just says "No reviews yet".
// When reviews exist, return { average, count } here.
async function find_rating(/* booking */) {
    return null;
}

// Splits a list of bookings into the sections shown on the bookings pages.
function group_bookings(list, todayStart) {
    const groups = { upcoming: [], pending: [], past: [], cancelled: [] };
    for (const b of list) {
        if (b.status === "cancelled") groups.cancelled.push(b);
        else if (b.status === "pending") groups.pending.push(b);
        else if (b.status === "completed" || b.checkOut < todayStart) groups.past.push(b);
        else groups.upcoming.push(b);
    }
    groups.past.reverse(); // most recent first
    return groups;
}

// ---------------------------------------------------------------------------
// GET /listings/:id/availability   (public, read-only)
// Returns ONLY date ranges. No names, ids, amounts or payment data.
// ---------------------------------------------------------------------------
module.exports.get_availability = async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid listing id." });
        }
        if (!(await Listing.exists({ _id: id }))) {
            return res.status(404).json({ message: "Listing not found." });
        }

        const today = todayString();
        const ranges = await Booking.confirmedRanges(id, startOfToday());

        return res.json({
            today, // the server's idea of "today" (India), so the calendar agrees with the backend
            unavailableDates: ranges.map((r) => ({
                checkIn: toDateString(r.checkIn),
                checkOut: toDateString(r.checkOut),
            })),
        });
    } catch (err) {
        console.error("Availability error:", err);
        return res.status(500).json({ message: "Could not load availability." });
    }
};

// ---------------------------------------------------------------------------
// GET /listings/:id/book?checkIn=..&checkOut=..&guests=..
// Used when a logged-out visitor clicks "Book Now". The existing isLogin
// middleware remembers this URL, so after login/signup the visitor lands here
// and is sent back to the listing with their selection filled in.
// Nothing is created by this GET request.
// ---------------------------------------------------------------------------
module.exports.resume_booking = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        req.flash("error", "the listing does not exists !");
        return res.redirect("/listings");
    }

    const params = {};
    const dates = parseBookingDates(req.query.checkIn, req.query.checkOut);
    if (dates.ok) {
        params.checkIn = toDateString(dates.checkIn);
        params.checkOut = toDateString(dates.checkOut);
    }
    if (typeof req.query.guests === "string" && /^\d{1,3}$/.test(req.query.guests)) {
        params.guests = req.query.guests;
    }
    return res.redirect(listing_url(id, Object.keys(params).length ? params : null));
};

// ---------------------------------------------------------------------------
// POST /bookings
// Only listingId, checkIn, checkOut and guests are read from the request.
// Anything else the browser sends (price, total, user id ...) is ignored.
// ---------------------------------------------------------------------------
module.exports.create_booking = async (req, res) => {
    const { listingId, checkIn, checkOut, guests } = req.body;

    // 1. listing
    if (!isValidObjectId(listingId)) {
        req.flash("error", "the listing does not exists !");
        return res.redirect("/listings");
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
        req.flash("error", "the listing does not exists !");
        return res.redirect("/listings");
    }
    const back = listing_url(listing._id);

    if (!listing.owner) {
        req.flash("error", "This listing is not accepting bookings.");
        return res.redirect(back);
    }
    if (listing.owner.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing.");
        return res.redirect(back);
    }
    if (!(Number(listing.price) > 0)) {
        req.flash("error", "This listing does not have a price yet, so it cannot be booked.");
        return res.redirect(back);
    }

    // 2. dates and guests (validated again on the server)
    const dates = parseBookingDates(checkIn, checkOut);
    if (!dates.ok) {
        req.flash("error", dates.message);
        return res.redirect(back);
    }
    const guestCheck = parseGuests(guests, getMaxGuests(listing));
    if (!guestCheck.ok) {
        req.flash("error", guestCheck.message);
        return res.redirect(back);
    }

    // 3. availability, checked against the latest confirmed bookings
    const taken = await Booking.hasConfirmedOverlap(listing._id, dates.checkIn, dates.checkOut);
    if (taken) {
        // The listing page is reloaded, which fetches fresh availability.
        req.flash("error", DATE_CONFLICT_MESSAGE);
        return res.redirect(back);
    }

    // 4. price, always from the listing in MongoDB
    const pricing = calculatePricing({
        pricePerNight: listing.price,
        nights: dates.nights,
    });

    const snapshot = {
        title: listing.title,
        imageUrl: listing.image && listing.image.url,
        location: listing.location,
        state: listing.state,
        checkInTime: listing.checkInTime,
        checkOutTime: listing.checkOutTime,
        cancellationPolicy: listing.cancellationPolicy,
    };

    const fields = {
        host: listing.owner,
        guests: guestCheck.guests,
        nights: pricing.nights,
        pricePerNight: pricing.pricePerNight,
        subtotal: pricing.subtotal,
        taxes: pricing.taxes,
        serviceFee: pricing.serviceFee,
        totalPrice: pricing.totalPrice,
        listingSnapshot: snapshot,
    };

    // 5. create the PENDING booking (or refresh the one from an earlier click,
    //    so repeated clicks do not pile up duplicates).
    //    status and paymentStatus stay "pending"; paymentId stays empty.
    let booking = await Booking.findOne({
        listing: listing._id,
        guest: req.user._id,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        status: "pending",
        paymentStatus: "pending",
    });

    if (booking) {
        booking.set(fields);
    } else {
        booking = new Booking({
            listing: listing._id,
            guest: req.user._id,
            checkIn: dates.checkIn,
            checkOut: dates.checkOut,
            status: "pending",
            paymentStatus: "pending",
            paymentId: null,
            ...fields,
        });
    }
    await booking.save();

    return res.redirect(`/bookings/${booking._id}/checkout`);
};

// ---------------------------------------------------------------------------
// GET /bookings/:id/checkout
// ---------------------------------------------------------------------------
module.exports.checkout_page = async (req, res) => {
    const booking = await find_booking(req, res);
    if (!booking) return;

    if (booking.status !== "pending") {
        return res.redirect(`/bookings/${booking._id}`);
    }

    const expired = booking.checkIn < startOfToday();
    const datesTaken = await Booking.hasConfirmedOverlap(
        booking.listing, booking.checkIn, booking.checkOut, booking._id
    );

    res.render("bookings/checkout.ejs", {
        booking,
        hostName: await find_host_name(booking),
        rating: await find_rating(booking),
        expired,
        datesTaken, // true means someone else already confirmed these nights
        conflictMessage: DATE_CONFLICT_MESSAGE,
    });
};

// ---------------------------------------------------------------------------
// POST /bookings/:id/pay
//
// The "Pay Now" button lands here. Until you connect a payment gateway this
// only re-validates the booking and redirects to a placeholder page.
// It NEVER marks anything as paid or confirmed.
// ---------------------------------------------------------------------------
module.exports.pay_booking = async (req, res) => {
    const booking = await find_booking(req, res);
    if (!booking) return;

    if (booking.status !== "pending" || booking.paymentStatus !== "pending") {
        req.flash("error", "This booking can no longer be paid for.");
        return res.redirect(`/bookings/${booking._id}`);
    }
    if (booking.checkIn < startOfToday()) {
        req.flash("error", "The check-in date has already passed. Please make a new booking.");
        return res.redirect(`/bookings/${booking._id}`);
    }

    // Always check against the latest confirmed bookings BEFORE asking anyone to pay.
    const taken = await Booking.hasConfirmedOverlap(
        booking.listing, booking.checkIn, booking.checkOut, booking._id
    );
    if (taken) {
        req.flash("error", DATE_CONFLICT_MESSAGE);
        return res.redirect(`/bookings/${booking._id}/checkout`);
    }

    // =====================================================================
    //  PAYMENT GATEWAY INTEGRATION POINT
    //  Connect Razorpay (or another payment gateway) here.
    //  Do not mark the booking as paid until server-side verification succeeds.
    //
    //  Data you can use, all calculated on the server and safe to trust:
    //    booking._id            MongoDB id (use it to find the booking again)
    //    booking.bookingRef     "ATTH5F3A9C21", handy as the gateway "receipt"
    //    booking.amountInPaise  integer amount in paise (Razorpay wants this)
    //    booking.totalPrice     amount in rupees, booking.currency is "INR"
    //    booking.guest          the paying user's id (also req.user)
    //    booking.listing, booking.host, booking.checkIn, booking.checkOut,
    //    booking.guests, booking.nights, booking.listingSnapshot.title
    //
    //  Your job, in this order:
    //    1. Create a gateway order for booking.amountInPaise
    //       (you will probably want to add a field such as
    //        gatewayOrderId to models/booking.js to remember it)
    //    2. Send the order details to the browser and open the gateway checkout
    //    3. Receive the browser callback on a NEW route (e.g. POST /bookings/:id/verify)
    //    4. Verify the gateway signature on the server
    //    5. Check that the verified amount equals booking.amountInPaise
    //    6. Only then, in one place:
    //           booking.paymentStatus = "paid";
    //           booking.paymentId = <gateway payment id>;
    //           booking.status = "confirmed";
    //           await booking.save();
    //
    //  About step 6: models/booking.js refuses to save a "confirmed" booking
    //  whose nights are already confirmed for someone else. It throws a
    //  DateConflictError, or a MongoDB E11000 error if two requests race.
    //  Test both with isDoubleBookingError(err) from utils/booking.js.
    //  If that happens after the money was taken, refund the payment.
    //
    //  Once a booking is confirmed, GET /listings/:id/availability returns
    //  its dates automatically. Nothing else needs to change.
    // =====================================================================

    return res.redirect(`/bookings/${booking._id}/payment-placeholder`);
};

// ---------------------------------------------------------------------------
// GET /bookings/:id/payment-placeholder
// Temporary page. Delete it (and its view) once the gateway is connected.
// ---------------------------------------------------------------------------
module.exports.payment_placeholder = async (req, res) => {
    const booking = await find_booking(req, res);
    if (!booking) return;
    res.render("bookings/payment_placeholder.ejs", { booking });
};

// ---------------------------------------------------------------------------
// GET /bookings/:id   (the guest, or the host of that listing)
// ---------------------------------------------------------------------------
module.exports.show_booking = async (req, res) => {
    const booking = await find_booking(req, res, { allowHost: true });
    if (!booking) return;

    const isGuest = booking.guest.equals(req.user._id);
    const guestUser = isGuest
        ? null
        : await User.findById(booking.guest).select("first_name last_name").lean();

    res.render("bookings/show.ejs", {
        booking,
        isGuest,
        guestName: guestUser ? `${guestUser.first_name} ${guestUser.last_name}`.trim() : null,
        hostName: await find_host_name(booking),
        rating: await find_rating(booking),
    });
};

// ---------------------------------------------------------------------------
// GET /bookings   (my trips)
// ---------------------------------------------------------------------------
module.exports.my_bookings = async (req, res) => {
    const list = await Booking.find({ guest: req.user._id }).sort({ checkIn: 1 });
    res.render("bookings/index.ejs", {
        groups: group_bookings(list, startOfToday()),
        total: list.length,
        todayStart: startOfToday(),
    });
};

// ---------------------------------------------------------------------------
// GET /host/bookings   (bookings on the logged-in user's own listings)
// ---------------------------------------------------------------------------
module.exports.host_bookings = async (req, res) => {
    const list = await Booking.find({ host: req.user._id })
        .populate("guest", "first_name last_name")
        .sort({ checkIn: 1 });
    res.render("bookings/host.ejs", {
        groups: group_bookings(list, startOfToday()),
        total: list.length,
        todayStart: startOfToday(),
    });
};
