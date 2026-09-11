const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
  },

  price: Number,

  // Human-readable location
  location: {
    type: String
  },

  country: {
    type: String
    
  },

  state :{
    type : String,
    required : true,
  },

  // Exact latitude and longitude
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },
  },

  // GeoJSON location
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

// Important for future nearby-property searches
listingSchema.index({ geometry: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing){
//         await review.deleteMany({_id : {$in : listing.reviews}});
//     }
// });

