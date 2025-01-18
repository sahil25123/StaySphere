const joi = require('joi');
const Listing = require('./models/listing');

const listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow('',null),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required()
        })
})
module.exports = listingSchema;
