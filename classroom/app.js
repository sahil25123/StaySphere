const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Hello World');
    });


//index route
app.get("/user", ( async (req,res) => {
    res.send("user")
}));

app.get("/user/new", (req,res)=>{
    res.send("new user")
        
}
);
app.post("/user", ( async (req, res) => {
    const { name, email } = req.body;
    res.send("user created")
    }));
    






app.listen(3000, () => {
    console.log('Server is listening on port 3000')
});


