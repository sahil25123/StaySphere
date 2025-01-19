const express = require("express");
const router = express.Router();

router.post("/", ( async (req, res) => {
    //const { name, email } = req.body;
    res.send("user created")
    }));

router.post("/new", (req, res) => {
    res.send("new user created")
    }
    );
    
module.exports = router;
    