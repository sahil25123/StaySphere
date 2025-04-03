 const Listing = require("./models/listing")
 const Review= require("./models/review")
 const ExpressError= require('./utils/ExpressError.js');
 const {listingSchema, reviewSchema}= require('./schema.js');
 const review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl; 
      req.flash("error", "You must be logged in to create a listing");
      return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
      delete req.session.redirectUrl; 
  } else {
      res.locals.redirectUrl = '/'; 
  }
  next();
};

module.exports.isOwner = async(req, res, next)=>{

  let {id} = req.params;
  let listing = await Listing.findById(id)
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You must be the owner of this listing");
    return res.redirect("/"); 
  }
  next();

}
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
      const message = error.details.map(el => el.message).join(',');
      throw new ExpressError(message, 400);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) 
    {
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(message, 400);
  }
    next();
};

module.exports.isReviewAuthor = async(req, res, next)=>{

  let { id,reviewId} = req.params;
  let review = await Review.findById(reviewId)
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You must be the owner of this Review");
    return res.redirect(`/listings/${id}`);


  }
  next();

}
