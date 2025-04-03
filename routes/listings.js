const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listing_controller.js');
const multer = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage });

//index route
router.get("/", wrapAsync(listingController.index));
router.get('/filter', async (req, res) => {
    const { category } = req.query;
    const listings = await Listing.find({
        category: { $regex: new RegExp(`^${category}$`, 'i') }
      });
      
      //console.log('Listings found:', listings); 
      res.json(listings);
  });
  

// new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.get('/search',listingController.searchListings);

//create route
router.post("/",isLoggedIn,upload.single("image"),wrapAsync(listingController.createNewListings));

  
// show route
router.get("/:id", wrapAsync(listingController.showListing));

router.get("/:id/book", isLoggedIn, listingController.Booking);
//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("image"), wrapAsync(listingController.updateListing));


//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)); 

module.exports=router;