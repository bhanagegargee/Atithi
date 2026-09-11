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

// module.exports.new_listing=async (req,res)=>{
//    let content=req.body.listing;
//    content.owner=res.locals.current_user._id;
//     // console.log(content);

//       content.image = {
//     url: req.file.path,
//     filename: req.file.filename,
//      };
//     const new_listing = new listing(content);
//     await new_listing.save();
//     req.flash("success","new listing added !");
//     res.redirect("/listings");
// };

module.exports.new_listing = async (req, res) => {

    try {

        let content = req.body.listing;

        content.owner =
            res.locals.current_user._id;


        // -----------------------------------------
        // GET COORDINATES
        // -----------------------------------------

        const latitude =
            Number(content.latitude);

        const longitude =
            Number(content.longitude);


        // -----------------------------------------
        // VALIDATE COORDINATES
        // -----------------------------------------

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {

            req.flash(
                "error",
                "Please select a valid location on the map."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // -----------------------------------------
        // REVERSE GEOCODING
        // -----------------------------------------

        const apiKey =
            process.env.GEOAPIFY_API_KEY;


        if (!apiKey) {

            throw new Error(
                "GEOAPIFY_API_KEY is missing"
            );

        }


        const geoapifyURL =
            `https://api.geoapify.com/v1/geocode/reverse` +
            `?lat=${encodeURIComponent(latitude)}` +
            `&lon=${encodeURIComponent(longitude)}` +
            `&apiKey=${encodeURIComponent(apiKey)}`;


        const response =
            await fetch(geoapifyURL);


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.features ||
            data.features.length === 0
        ) {

            console.error(
                "Geoapify reverse geocoding failed:",
                data
            );

            req.flash(
                "error",
                "Unable to determine the selected address."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        const properties =
            data.features[0].properties;


        // -----------------------------------------
        // GENERATE LOCATION
        // -----------------------------------------

        const address =
            properties.formatted ||
            properties.address_line1 ||
            "";


        // -----------------------------------------
        // MAKE SURE ADDRESS EXISTS
        // -----------------------------------------

        if (!address ) {

            console.error(
                "Incomplete Geoapify result:",
                properties
            );

            req.flash(
                "error",
                "Could not determine a complete address."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // -----------------------------------------
        // SAVE VERIFIED ADDRESS
        // -----------------------------------------

        content.location =
            address;



        // -----------------------------------------
        // SAVE COORDINATES
        // -----------------------------------------

        content.coordinates = {

            latitude:
                latitude,

            longitude:
                longitude

        };


        // -----------------------------------------
        // SAVE GEOJSON
        // -----------------------------------------

        content.geometry = {

            type: "Point",

            coordinates: [
                longitude,
                latitude
            ]

        };


        // -----------------------------------------
        // REMOVE TEMPORARY FIELDS
        // -----------------------------------------

        delete content.latitude;
        delete content.longitude;


        // -----------------------------------------
        // IMAGE
        // -----------------------------------------

        if (req.file) {

            content.image = {

                url:
                    req.file.path,

                filename:
                    req.file.filename

            };

        }


        // -----------------------------------------
        // CREATE LISTING
        // -----------------------------------------

        const new_listing =
            new listing(content);


        await new_listing.save();


        req.flash(
            "success",
            "New listing added!"
        );


        res.redirect("/listings");


    } catch (error) {

        console.error(
            "Create listing error:",
            error
        );

        req.flash(
            "error",
            "Something went wrong while creating the listing."
        );

        res.redirect(
            "/listings/new"
        );

    }

};

module.exports.reverse_geo = async (req, res) => {

        try {

            const { lat, lon } = req.query;

            const latitude = Number(lat);
            const longitude = Number(lon);


            // -----------------------------------------
            // VALIDATE COORDINATES
            // -----------------------------------------

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                latitude < -90 ||
                latitude > 90 ||
                longitude < -180 ||
                longitude > 180
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid coordinates"
                });

            }


            // -----------------------------------------
            // CHECK API KEY
            // -----------------------------------------

            const apiKey =
                process.env.GEOAPIFY_API_KEY;


            if (!apiKey) {

                console.error(
                    "GEOAPIFY_API_KEY is missing"
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Geoapify API key is not configured"
                });

            }


            // -----------------------------------------
            // GEOAPIFY URL
            // -----------------------------------------

            const geoapifyURL =
                `https://api.geoapify.com/v1/geocode/reverse` +
                `?lat=${encodeURIComponent(latitude)}` +
                `&lon=${encodeURIComponent(longitude)}` +
                `&apiKey=${encodeURIComponent(apiKey)}`;


            console.log(
                "Reverse geocode request:",
                latitude,
                longitude
            );


            // -----------------------------------------
            // CALL GEOAPIFY
            // -----------------------------------------

            const response =
                await fetch(geoapifyURL);


            const responseText =
                await response.text();


            console.log(
                "Reverse geocode status:",
                response.status
            );


            console.log(
                "Reverse geocode response:",
                responseText
            );


            // -----------------------------------------
            // HANDLE GEOAPIFY ERROR
            // -----------------------------------------

            if (!response.ok) {

                return res.status(502).json({
                    success: false,
                    message:
                        "Geoapify reverse geocoding failed",
                    status:
                        response.status,
                    details:
                        responseText
                });

            }


            const data =
                JSON.parse(responseText);


            // -----------------------------------------
            // CHECK FEATURES
            // -----------------------------------------

            if (
                !data.features ||
                data.features.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "No address found for this location"
                });

            }


            // -----------------------------------------
            // GET FIRST RESULT
            // -----------------------------------------

            const properties =
                data.features[0].properties;


            console.log(
                "Geoapify properties:",
                properties
            );


            // -----------------------------------------
            // ADDRESS
            // -----------------------------------------

            const address =
                properties.formatted ||
                properties.address_line1 ||
                properties.address_line2 ||
                "";


            // -----------------------------------------
            // COUNTRY
            // -----------------------------------------

            const country =
                properties.country ||
                "";


            // -----------------------------------------
            // SEND RESULT
            // -----------------------------------------

            return res.json({

                success: true,

                address: address,

                country: country,

                city:
                    properties.city ||
                    properties.town ||
                    properties.village ||
                    properties.municipality ||
                    "",

                state:
                    properties.state ||
                    "",

                postcode:
                    properties.postcode ||
                    "",

                latitude:
                    properties.lat ||
                    latitude,

                longitude:
                    properties.lon ||
                    longitude

            });

        } catch (error) {

            console.error(
                "Reverse geocoding error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Internal reverse geocoding error"

            });

        }

    };

module.exports.show_record=async (req,res)=>{
    const {id}=req.params;
    const one_listing= await listing.findById(id);
    if(!one_listing){
        req.flash("error", "the listing does not exists !");
        return res.redirect("/listings");
    }


   
    res.render("listing/show.ejs",{one_listing});
};

module.exports.update_route=async (req,res)=>{
    const {id}=req.params;

    const update_listing= await listing.findById(id);
    res.render("listing/update_page.ejs",{update_listing});
};

module.exports.update_record=async (req,res)=>{
    const {id}=req.params;
    const record=await listing.findByIdAndUpdate(id , {...req.body.listing} ,{runValidators :true });
    
    if(typeof req.file !== "undefined")
    {
        record.image = {
            url: req.file.path,
            filename: req.file.filename,
            };
        record.save();
    }
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