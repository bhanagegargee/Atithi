    //middleware that checks user is loged in or not

    module.exports.isLogin = (req,res,next)=>{
        if(!req.isAuthenticated())
        {
            // req.flash("error","you must need to login first !");
            //store the previous page url
            req.session.url=req.originalUrl;
            return res.send(`
                <script>
                alert("you must need to login fiest !")
                window.location.href='/signup'
                </script>
                `);
        }
        next();
    };

    module.exports.save_url=(req,res,next)=>{
        if(req.session.url){
            res.locals.redirecturl=req.session.url;
        }
        next();
    };

// module.exports.hasaccess =async (req,res,next)=>{
//         let {id}=req.params;
//          const one_listing = await listing.findById(id);
//           if (!one_listing.owner.equals(req.user._id)) {
//             req.flash("error", "You don't have permission to access this listing!");
//             return res.redirect(`/listings/${id}`);
//         }
//     next();
// };