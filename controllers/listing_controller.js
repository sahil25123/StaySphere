const Listing = require('../models/listing.js');

module.exports.index =async (req,res) => {
    const allListing= await Listing.find({})
    res.render("listings/index.ejs", {listings: allListing})
  }

module.exports.renderNewForm =(req,res)=>{

    res.render("listings/new.ejs")
}

module.exports.searchListings =async (req, res) => {
  const { query } = req.query;
  try {
    const listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    });
    res.render('listings/search', { listings, query });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
}


module.exports.createNewListings=async (req, res) => { 
  let url=req.file.path;
  let filename=req.file.filename
    let { title, description, price, location, country , category} = req.body;
    category = Array.isArray(category) ? category : [category];

    // Create the listing object with the image properly formatted
    const listing = new Listing({
        title,
        description,
        image: {
            filename: filename, 
            url: url, 
        },
        price,
        location,
        country,
        category,
    });
    listing .owner=req.user._id;
    listing.image= {filename,url};
  
    await listing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings/${listing._id}`);
    //console.log(req.file)
        
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

  module.exports.Booking=(req,res)=>{
    req.flash("success","Booking Confirmed! A confirmation has been sent to the listing owner.")
    res.redirect(`/listings`)
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
    let { title, description, image, price, location, country, category } = req.body;
  
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
                ? { filename: existingListing.image.filename, url: image } 
                : existingListing.image, 
            price,
            location,
            country,
            category,
        },
        { new: true } 
    );
    if(typeof req.file !== 'undefined'){ 
      let url=req.file.path;
      let filename=req.file.filename
      listing.image= {filename,url}; 
      await listing.save();

    }
    
    req.flash('success', 'Successfully updated a listing!');
    res.redirect(`/listings/${listing._id}`);
  }
  module.exports.deleteListing=async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect("/listings");
    }
    