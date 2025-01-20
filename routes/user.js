const express=require('express');
const router=express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport= require('passport');
const {savedRedirectUrl} = require("../middleware.js") 

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs'); 
});
router.post('/signup', wrapAsync(async(req, res) => {
   try{
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err)
        };
        req.flash('success', 'Welcome to StaySphere!');
        res.redirect('/');
        });

   }
   catch(e){
    req.flash('error', e.message);
    res.redirect("/signup")
   }
}))

router.get("/login",(req,res)=>{
    res.render('users/login.ejs');
})
router.post(
    '/login',
    savedRedirectUrl, // Middleware to retrieve and clear the saved URL
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        req.flash('success', 'Welcome back to StaySphere!');
        const redirectUrl = res.locals.redirectUrl || '/'; // Default to home if no URL is saved
        res.redirect(redirectUrl); // Redirect to the saved or default URL
    }
);

router.get('/logout', (req, res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
    req.flash('success', 'Goodbye!');
    res.redirect('/');
    })
});
module.exports = router;




















module.exports=router;