const express= require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate'); 
const ExpressError= require('./utils/ExpressError.js');
const cors = require('cors');
const joi= require('joi');
const listingRoutes = require('./routes/listings.js'); 
const reviewsRoutes = require('./routes/reviews.js');

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


// Route to render the home page with featured listings
// Route to render the home page with featured listings
app.get("/", async (req, res) => {
    try {
        // Fetch the first 6 featured listings from the database
        const featuredListings = await Listing.find().limit(6);

        // Render the page with the fetched listings
        res.render("home", { featuredListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Something went wrong while fetching the listings.");
    }
});


app.use('/listings', listingRoutes);
app.use("/listings/:id/reviews",reviewsRoutes);


//404 route
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

//Error handling middleware
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err; 
    res.render("error.ejs", {err});
    //res.status(statusCode).send(message);
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });



