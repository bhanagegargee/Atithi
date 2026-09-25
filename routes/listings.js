const express= require('express');
const router= express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrap_async=require("../utils/WrapAsync.js");
const listing= require("../models/listing.js");      //model name
const { isLogin }=require("../middleware.js");

const { storage } = require("../cloud_config.js");
const multer = require('multer');
const upload = multer({ storage });

const controller = require("../controller/listing.js");


const booking_controller = require("../controller/booking.js");

console.log(
    "Geoapify key loaded:",
    process.env.GEOAPIFY_API_KEY ? "YES" : "NO"
);


//show listings of host only
router.get("/host",wrap_async (controller.host_records));


//create new listing route 
router.get("/new",isLogin ,wrap_async(async(req,res)=>{
    // res.render("listing/new.ejs");

      res.render("listing/new.ejs", {
        geoapifyApiKey: process.env.GEOAPIFY_API_KEY
    });
}));



//reverse geocoding
router.get("/reverse-geocode", isLogin, wrap_async(controller.reverse_geo));

// Explore India by State - state selection page
// IMPORTANT: must be registered before router.route("/:id") below,
// otherwise "/listings/states" would be swallowed by the ":id" param route.
router.get("/states", wrap_async(controller.list_states));

// Explore India by State - listings filtered by a specific state
// Two segments ("/state/:state"), so it can't collide with "/:id",
// but kept alongside "/states" for clarity.
router.get("/state/:state", wrap_async(controller.state_records));

router.route("/")
.post(upload.single("listing[image]"),wrap_async (controller.new_listing))

//show all records
.get(wrap_async (controller.all_records));


//show specific 
//delete specific
router.route("/:id")
.get(wrap_async (controller.show_record))
.delete(isLogin,wrap_async(controller.delete_route));


//update an existing listing 
router.get("/:id/edit",isLogin ,wrap_async (controller.update_route));
router.put("/:id",isLogin,upload.single("listing[image]"),wrap_async (controller.update_record));


// ---- booking feature -------------------------------------------------------

// availability of one listing (public, returns date ranges only)
router.get("/:id/availability", wrap_async(booking_controller.get_availability));

// where a logged-out visitor is sent back to after "Book Now" + login
router.get("/:id/book", isLogin, wrap_async(booking_controller.resume_booking));



module.exports=router;