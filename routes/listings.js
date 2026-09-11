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



module.exports=router;