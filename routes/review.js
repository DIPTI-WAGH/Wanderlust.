const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");




// POST route to create a review
router.post("/", validateReview,isLoggedIn, wrapAsync(
    async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review); 
        newReview.author=req.user._id;
        console.log(newReview)
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
            req.flash("success","New Review Created!");
    
        res.redirect(`/listings/${listing._id}`);
    }));

router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
  }));

module.exports = router;
