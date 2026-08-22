const user= require("../models/user.js");
const passport=require("passport");

module.exports.signup_get=async(req,res)=>{
    res.render("../views/user/signup.ejs");
};

module.exports.signup_post=async (req,res,next)=>{

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
   
};

module.exports.login_get=async(req,res)=>{
    res.render("../views/user/login.ejs");
};


module.exports.login_post=async(req,res)=>{
      let redirect_url= res.locals.redirecturl || "/listings";
         res.redirect(redirect_url);
};

