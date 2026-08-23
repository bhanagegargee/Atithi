if(process.env.NODE_ENV !='production')
{
   require("dotenv").config();
}


const listing= require("./models/listing.js");      //listings model name
const user= require("./models/user.js");      //user model name

const listings_routes = require("./routes/listings.js");
const user_routes=require("./routes/users.js");

const express= require('express');
const path=require("path");
const methodOverride = require('method-override');
const ejsMate= require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const wrap_async=require("./utils/WrapAsync.js");
const app=express();
let port=8080;

//session
const session=require("express-session");
const flash=require("connect-flash");
app.use(flash());

//authentication using passport
const passport=require("passport");
const localStratergy = require("passport-local");

app.engine("ejs",ejsMate);

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(session(
    {
        secret : "gargee",
        resave : false,
        saveUninitialized: true,
        cookie : {
            expires: Date.now()+7*24*60*60*1000,
            maxAge : 7*24*60*60*1000,
        }
    }
));




//configuring passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratergy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.current_user=req.user;
    next();
});

//connecting with mongodb 
const mongoose=require("mongoose");
const WrapAsync = require("./utils/WrapAsync.js");

main()
.then(()=>
{
    console.log("conection !");
}) 
.catch((err)=>
{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/listing");
}


//routes
app.listen(port,()=>{
    console.log("server started !");
})

app.get("/",(req,res)=>
{
    res.send( "welcome home");
});

//listings routes
app.use("/listings",listings_routes);
app.use("/", user_routes);




//wrong route call error handler
app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"page not found !"));
});

//all kinds of error handler  (this is ending middleware so only this will send the respnse)
app.use((err,req,res,next)=>{
    let {status=500 , message='something went wrong gargee !!!'} = err;
    res.render("listing/error.ejs" , {message});

    //     console.log("ERROR:", err);
    // console.log("MESSAGE:", err.message);
    // console.log("STACK:", err.stack);

    // res.status(err.statusCode || 500).send(err.message);

});

