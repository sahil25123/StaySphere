const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Reviews = require('../models/review.js');
const ExpressError= require('../utils/ExpressError.js');
;
const { validateReview } = require('../middleware.js');
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController = require('../controllers/review_controller.js');

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;