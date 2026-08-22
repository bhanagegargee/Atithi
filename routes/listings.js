const express= require('express');
const router= express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrap_async=require("../utils/WrapAsync.js");
const listing= require("../models/listing.js");      //model name
const { isLogin }=require("../middleware.js");
const multer = require('multer');
const upload = multer({ dest : 'uploads/'});

const controller = require("../controller/listing.js");



//show listings of host only
router.get("/host",wrap_async (controller.host_records));


//create new listing route 
router.get("/new",isLogin ,wrap_async(async(req,res)=>{
    res.render("listing/new.ejs");
}));


//testinggggggggg****************
router.route("/")
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
})
// .post(wrap_async (controller.new_listing))
//show all records
.get(wrap_async (controller.all_records));


//show specific 
//delete specific
router.route("/:id")
.get(wrap_async (controller.show_record))
.delete(wrap_async(controller.delete_route));


//update an existing listing 
router.get("/:id/edit" ,wrap_async (controller.update_route));
router.put("/:id",wrap_async (controller.update_record));



module.exports=router;