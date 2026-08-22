const express= require('express');
const router= express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrap_async=require("../utils/WrapAsync.js");
const user= require("../models/user.js");
const { isLogin }= require("../middleware.js");
const passport=require("passport");
const { save_url }=require("../middleware.js");

const controller= require("../controller/user.js");

router.route("/signup")
.get(wrap_async( controller.signup_get))
.post(save_url, wrap_async(controller.signup_post));


router.route("/login")
.get(wrap_async( controller.login_get))
.post(save_url,passport.authenticate('local',{ failureFlash: true , failureRedirect: "/login" }) ,wrap_async( controller.login_post));

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