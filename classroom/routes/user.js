const express = require('express');
const app = express();
const router = express.Router();

//index route
router.get("/", ( async (req,res) => {
    res.send("user")
}));

router.get("/new", (req,res)=>{
    res.send("new user")
        
}
);

module.exports = router;