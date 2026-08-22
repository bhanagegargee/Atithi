const listing = require("../models/listing.js");

module.exports.all_records=async (req,res)=>{
    const listings= await listing.find({ });
    res.render("listing/index.ejs",{listings});
};

module.exports.host_records=async (req,res)=>{
    const accessed_listings= await listing.find({
        owner : res.locals.current_user
    });
    res.render("listing/host_listing.ejs",{accessed_listings}); 
};

module.exports.new_listing=async (req,res)=>{
   let content=req.body.listing;
   content.owner=res.locals.current_user._id;
    // console.log(content);
    const new_listing = new listing(content);
    await new_listing.save();
    req.flash("success","new listing added !");
    res.redirect("/listings");
};


module.exports.show_record=async (req,res)=>{
    const {id}=req.params;
    const one_listing= await listing.findById(id);
    if(!one_listing){
        req.flash("error", "the listing does not exists !");
        return res.redirect("/listings");
    }

//    const access = res.locals.current_user
//         ? one_listing.owner.equals(res.locals.current_user._id)
//         : false;
   
    res.render("listing/show.ejs",{one_listing});
};

module.exports.update_route=async (req,res)=>{
    const {id}=req.params;

    const update_listing= await listing.findById(id);
    res.render("listing/update_page.ejs",{update_listing});
};

module.exports.update_record=async (req,res)=>{
    const {id}=req.params;
    await listing.findByIdAndUpdate(id , {...req.body.listing} ,{runValidators :true });
   
    res.redirect(`/listings/${id}`);
};

module.exports.delete_route=async (req,res)=>{
    const {id}=req.params;

    //  const one_listing = await listing.findById(id);
    //   if (!one_listing.owner.equals(req.user._id)) {
    //     req.flash("error", "You don't have permission to delete this listing!");
    //     return res.redirect(`/listings/${id}`);
    // }

    await listing.findByIdAndDelete(id);
    
    res.redirect("/listings");
};