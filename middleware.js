const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!")
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//isowner middleware
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // If listing not found
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); //
    }

    // Check if current user is the owner
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`); // ✅ Stop execution
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // ✅ correct destructuring
    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    next();
};

// Middleware to validate review schema
module.exports.validateReview = (req, res, next) => {

    if (!req.body.review) {  // ✅ Add this guard
        req.flash("error", "Invalid form submission");
        return res.redirect("back");
    }


    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    next();
};
//isreviewauthor middleware

const Review = require("./models/review"); 

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);

    // If the review doesn't exist
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // Check if the current user is the review's author
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to modify this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
