const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    description: String,
    price: {
        type: Number,
        required: true,  
    },
    image: {
        filename: {
            type: String,
            default: 'listingimage', 
        },
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1735675376752-2e0fb3de9f69?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default image URL
            set: (v) => v === "" ? 'https://images.unsplash.com/photo-1735675376752-2e0fb3de9f69?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : v, // Setter function for empty string
        },
    },
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category: {
        type: [String],
        enum: ['Trending', 'Mountains', 'Beach', 'Hotel', 'City', 'Pools', 'Farms', 'Arctic', 'Igloo', 'Boathouse' , "Historic"],  // Enforcing the category values
        required: true,
      },

});

listingSchema.post('findOneAndDelete', async  (listing)=> {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
