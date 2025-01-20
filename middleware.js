 const Listing = require("./models/listing")
 const ExpressError= require('./utils/ExpressError.js');
 const {listingSchema, reviewSchema}= require('./schema.js');


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl; // Fix typo from `req.OriginalUrl` to `req.originalUrl`
      req.flash("error", "You must be logged in to create a listing");
      return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
      delete req.session.redirectUrl; // Clear the session value after using it
  } else {
      res.locals.redirectUrl = '/'; // Default to home if no redirectUrl is saved
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
