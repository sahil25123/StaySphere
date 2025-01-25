if(process.env.NODE_ENV !=="production"){
  require("dotenv").config({ path: "../.env" });
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Connect to MongoDB using Atlas DB URI
const db_url= process.env.ATLASDB_URL


mongoose.connect(db_url )
main().then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(db_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj) => ({...obj , owner:"67955bcf6dfb879c9ef6c02f"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();