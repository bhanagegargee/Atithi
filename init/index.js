//run this file to initiaize a sample data stored at data.js file

const mongoose= require("mongoose");
const sampleData=require("./data.js");
const listing =require("../models/listing.js");

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

const initialize_db= async ()=>{
    await listing.deleteMany({});

    sampleData.data = sampleData.data.map((obj)=>({
        ...obj,
        owner : '6a8426bcae469ce28eb30a3a',
    }));
    await listing.insertMany(sampleData.data);

    console.log("data initialize");
}

initialize_db();