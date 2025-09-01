const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// INDEX & CREATE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createlisting)
    );

// NEW FORM
router.get("/new", isLoggedIn, listingController.renderNewform);

// SEARCH
router.get("/search", wrapAsync(async (req, res) => {
    const query = req.query.q ? req.query.q.toString() : "";
    const listings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    });
    res.render("listings/index", { allListings: listings });
}));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditform));

// UPDATE
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updatelisting));

// DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroylisting));

// SHOW
router.get("/:id", wrapAsync(listingController.showlisting));

module.exports = router;
