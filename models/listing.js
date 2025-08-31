// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
// const Review=require("./review.js");
// const listingSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
// image: {
//     url: {
//         type: String,
//         default: "https://via.placeholder.com/400", // Fallback image URL
//     },
//     filename: {
//         type: String,
//         default: "default.jpg"
//     }
// },

//   price: Number,
//   location: String,
//   country: String,
//   reviews:[
//     {
//       type:Schema.Types.ObjectId,
//       ref:"Review"
//     }
//   ],
//   owner:{
//     type:Schema.Types.ObjectId,
//     ref:"User",
//   }
// });
// listingSchema.post("findOneAndDelete", async function (listing) {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//     console.log("Deleted all associated reviews");
//   }
// });

// const Listing=mongoose.model("Listing",listingSchema);
// module.exports=Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://via.placeholder.com/400", // Fallback image
    },
    filename: {
      type: String,
      default: "default.jpg",
    },
  },
  price: { type: Number, required: true },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Deleted all associated reviews");
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
