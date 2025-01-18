const express= require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError= require('./utils/ExpressError.js');
const cors = require('cors');
const joi= require('joi');
const {listingSchema}= require('./schema.js');



 

const port = 3001; 
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/StaySphere')
main().then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/StaySphere');
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    next();
};
//app.use(validateListing);
 


app.get('/', (req, res) => {
    res.send('Hello World');
    }
)

//index route
app.get("/listings", wrapAsync( async (req,res) => {
      const allListing= await Listing.find({})
      res.render("listings/index.ejs", {listings: allListing})
    }));

// new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
        
});

//create route
app.post("/listings",wrapAsync(async (req, res) => {

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

    await listing.save();
    res.redirect(`/listings/${listing._id}`);
        
}));

    
// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing}) 
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);

    res.render("listings/edit.ejs", {listing})

}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
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

    res.redirect(`/listings/${listing._id}`);
}));


//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    }));  

// 404 route
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});


// Error handling middleware
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err; 
    res.render("error.ejs", {err});
    //res.status(statusCode).send(message);
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });
