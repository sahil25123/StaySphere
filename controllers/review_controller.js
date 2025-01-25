const Reviews = require('../models/review.js');
const Listing = require('../models/listing.js')

module.exports.createReview= async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    // Validate review data
    if (!req.body.review || !req.body.review.comment ) {
        throw new ExpressError("Invalid review data", 400);
    }
    let review = new Reviews(req.body.review); 
    review.author =req.user._id; 
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);
}   