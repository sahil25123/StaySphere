const User = require('../models/user.js');


module.exports.renderSignupForm=(req, res) => {
    res.render('users/signup.ejs'); 
}

module.exports.signup=async(req, res) => {
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
};

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs');
};


module.exports.login=async(req, res) => {
        req.flash('success', 'Welcome back to StaySphere!');
        const redirectUrl = res.locals.redirectUrl || '/'; // Default to home if no URL is saved
        res.redirect(redirectUrl); // Redirect to the saved or default URL
    };


    

module.exports.logout=(req, res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
    req.flash('success', 'Goodbye!');
    res.redirect('/');
    })
}


