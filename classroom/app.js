const express = require('express');
const app = express();
const user = require('./routes/user');
const posts = require('./routes/post');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');


app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/getcookies",(req,res)=>{
    res.cookie("greet", "hello");
    res.cookie("madeInindia","yes");
    res.send("cookies set");
})
app.get("/greet",(req,res)=>{
    res.send(req.cookies.greet);
})

app.use("/user", user);
app.use("/posts", posts);

app.get('/', (req, res) => {
    console.dir(req.cookies);
    res.send('Hello World');
    });

app.use(session({secret:"my secret",
    resave: false,
    saveUninitialized: true,
    }));

app.use(flash());

app.get("/test",(req,res)=>{
    res.send("session test");
});

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send("count: "+req.session.count);
// });

app.get("/register",(req,res)=>{
    let {name ="anonymonus"} = req.query;
    req.session.name = name;
    req.flash("info","name saved");
    res.send(name);
})

app.get("/hello",(req,res)=>{
    
    res.render("page.ejs",{name:req.session.name,message:req.flash("info")});   
})







app.listen(3000, () => {
    console.log('Server is listening on port 3000')
});


