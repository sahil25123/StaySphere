const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Reviews = require('../models/review.js');
const {reviewSchema}= require("../schema.js")
const ExpressError= require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');

router.post("/", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    // Validate review data
    if (!req.body.review || !req.body.review.comment ) {
        throw new ExpressError("Invalid review data", 400);
    }
    let review = new Reviews(req.body.review);  
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    res.redirect(`/listings/${listing._id}`);
}));

module.exports=router;