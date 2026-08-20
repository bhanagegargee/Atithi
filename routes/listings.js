const express= require('express');
const router= express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrap_async=require("../utils/WrapAsync.js");
const listing= require("../models/listing.js");      //model name
const { isLogin, hasaccess }=require("../middleware.js");


//show all records
router.get("/",wrap_async (async (req,res)=>{
    const listings= await listing.find({ });
    res.render("listing/index.ejs",{listings});
}));

//show listings of host only
router.get("/host",wrap_async (async (req,res)=>{
    const accessed_listings= await listing.find({
        owner : res.locals.current_user
    });
    res.render("listing/host_listing.ejs",{accessed_listings}); 
}));



//create new listing route 
router.get("/new",isLogin ,wrap_async(async(req,res)=>{
    res.render("listing/new.ejs");
}));

router.post("/",wrap_async (async (req,res)=>{
   let content=req.body.listing;
   content.owner=res.locals.current_user._id;
    // console.log(content);
    const new_listing = new listing(content);
    await new_listing.save();
    req.flash("success","new listing added !");
    res.redirect("/listings");
}));


//show specific 
router.get("/:id",wrap_async (async (req,res)=>{
    const {id}=req.params;
    const one_listing= await listing.findById(id);
    if(!one_listing){
        req.flash("error", "the listing does not exists !");
        return res.redirect("/listings");
    }

   const access = res.locals.current_user
        ? one_listing.owner.equals(res.locals.current_user._id)
        : false;
   
    res.render("listing/show.ejs",{one_listing,access});
}));

//update an existing listing 
router.get("/:id/edit" ,hasaccess,wrap_async (async (req,res)=>{
    const {id}=req.params;

    const update_listing= await listing.findById(id);
    res.render("listing/update_page.ejs",{update_listing});
}));

router.put("/:id",wrap_async (async (req,res)=>{
    const {id}=req.params;
    await listing.findByIdAndUpdate(id , {...req.body.listing} ,{runValidators :true });
   
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id",hasaccess,wrap_async( async (req,res)=>{
    const {id}=req.params;

    //  const one_listing = await listing.findById(id);
    //   if (!one_listing.owner.equals(req.user._id)) {
    //     req.flash("error", "You don't have permission to delete this listing!");
    //     return res.redirect(`/listings/${id}`);
    // }

    await listing.findByIdAndDelete(id);
    
    res.redirect("/listings");
}));


module.exports=router;