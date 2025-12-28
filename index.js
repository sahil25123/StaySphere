if(process.env.NODE_ENV !=="production"){
    require("dotenv").config();
}
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
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRoutes = require('./routes/user.js');

const port = 3001; 
// Connect to MongoDB
 const db_url= process.env.ATLASDB_URL
mongoose.connect(db_url )
main().then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(db_url);
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const store =MongoStore.create({ 
    mongoUrl: db_url,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600
})

store.on("error", ()=>{
    console.log("Error in session store")
})

const sessionConfig = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    Cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // a.k.a. persistent login sessions
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 

// Middleware to set flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/about", (req, res, ) => {
    res.render("about.ejs");
}
)
app.use("/contact", (req, res, ) => {
    res.render("contact.ejs");
})
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Here you would typically save the email to your database
      // For this example, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating database operation
  
      // Flash a success message
      req.flash('success', 'Thank you for subscribing!');
      res.redirect('/');
    } catch (error) {
      console.error('Subscription error:', error);
      req.flash('error', 'An error occurred. Please try again.');
      res.redirect('/');
    }
  });
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
app.use('/', userRoutes);

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



 