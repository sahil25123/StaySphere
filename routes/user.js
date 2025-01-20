const express=require('express');
const router=express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport= require('passport');
 
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs'); 
});
router.post('/signup', wrapAsync(async(req, res) => {
   try{
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Welcome to the StaySphere!');
    res.redirect('/');

   }
   catch(e){
    req.flash('error', e.message);
    res.redirect("/signup")
   }

}))

router.get("/login",(req,res)=>{
    res.render('users/login.ejs');
})
router.post('/login',passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),
async(req,res)=>{
    req.flash('success','Welcome back to the StaySphere!');
    res.redirect('/');
});

module.exports = router;




















module.exports=router;