const Listing = require('../models/listing.js');



module.exports.index =async (req,res) => {
    const allListing= await Listing.find({})
    res.render("listings/index.ejs", {listings: allListing})
  }

module.exports.renderNewForm =(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.createNewListings=async (req, res) => { 
    let { title, description, image, price, location, country } = req.body;
  
    // Create the listing object with the image properly formatted
    const listing = new Listing({
        title,
        description,
        image: {
            filename: "listingimage", // Default filename or any placeholder value
            url: image, // The URL entered by the user
        },
        price,
        location,
        country,
    });
    listing .owner=req.user._id;
  
    await listing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings/${listing._id}`);
        
  }
  module.exports.showListing=async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id).populate({
      path:'reviews',
      populate:{path:"author"},
    }).populate('owner');
    if(!listing){
      req.flash('error', 'Listing you request for does not exist!');
      res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing}) 
  }
  module.exports.editListing=async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
      req.flash('error', 'Listing you request for does not exist!');
      res.redirect('/listings');
    }
  
    res.render("listings/edit.ejs", {listing})
  
  }
  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
  
    // Find the existing listing
    const existingListing = await Listing.findById(id);
  
    if (!existingListing) {
        return res.status(404).send("Listing not found");
    }
  
    // Update the listing and retain the existing image if not provided
    const listing = await Listing.findByIdAndUpdate(
        id,
        {
            title,
            description,
            image: image
                ? { filename: existingListing.image.filename, url: image } // Update URL, retain filename
                : existingListing.image, // Retain existing image object
            price,
            location,
            country,
        },
        { new: true } // Return the updated document
    );
    req.flash('success', 'Successfully updated a listing!');
    res.redirect(`/listings/${listing._id}`);
  }
  module.exports.deleteListing=async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect("/listings");
    }
    