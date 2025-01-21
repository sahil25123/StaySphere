const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listing_controller.js');



//index route
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//create route
router.post("/",isLoggedIn,wrapAsync(listingController.createNewListings));

  
// show route
router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

//update route
router.put("/:id",isLoggedIn,isOwner, wrapAsync(listingController.updateListing));


//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)); 

module.exports=router;