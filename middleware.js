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

