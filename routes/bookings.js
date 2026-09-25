// routes/bookings.js
// Mounted at "/" in app.js (like routes/users.js), so the full paths live here.
// Every route needs a logged-in user, so the existing isLogin middleware is reused.

const express = require("express");
const router = express.Router();
const wrap_async = require("../utils/WrapAsync.js");
const { isLogin } = require("../middleware.js");

const controller = require("../controller/booking.js");

// my bookings / create a booking
router.route("/bookings")
.get(isLogin, wrap_async(controller.my_bookings))
.post(isLogin, wrap_async(controller.create_booking));

// checkout -> Pay Now -> placeholder
router.get("/bookings/:id/checkout", isLogin, wrap_async(controller.checkout_page));
router.post("/bookings/:id/pay", isLogin, wrap_async(controller.pay_booking));
router.get("/bookings/:id/payment-placeholder", isLogin, wrap_async(controller.payment_placeholder));

// one booking (the guest, or the host of that listing)
router.get("/bookings/:id", isLogin, wrap_async(controller.show_booking));

// bookings made on the logged-in user's own listings
router.get("/host/bookings", isLogin, wrap_async(controller.host_bookings));

module.exports = router;
