const express= require('express');
const router= express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrap_async=require("../utils/WrapAsync.js");
const user= require("../models/user.js");
const { isLogin }= require("../middleware.js");
const passport=require("passport");
const { save_url }=require("../middleware.js");

router.get("/signup",wrap_async( async(req,res)=>{
    res.render("../views/user/signup.ejs");
}));

router.post("/signup",save_url, wrap_async(async (req,res,next)=>{

    try{
         let {first_name, last_name, email, username , password}=req.body;
    const new_user=new user({first_name,last_name,email,username});
    const registered_user= await user.register(new_user, password);
    
    req.login(registered_user,(err)=>{
        if(err)
        {
            return next(err);
        }
        let redirect_url= res.locals.redirecturl || '/listings';
         res.redirect(redirect_url);
    })

   
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
})
);

router.get("/login" ,wrap_async( async(req,res)=>{
    res.render("../views/user/login.ejs");
}));


router.post("/login",save_url,passport.authenticate('local',{ failureFlash: true , failureRedirect: "/login" }) ,wrap_async( async(req,res)=>{
      let redirect_url= res.locals.redirecturl || "/listings";
         res.redirect(redirect_url);
}));

router.get("/logout",isLogin ,(req,res)=>
{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","successfully loged out !");
         res.redirect("/login");
    });
    
});

module.exports=router;