const express = require('express');
const app = express();
const user = require('./routes/user');
const posts = require('./routes/post');


app.use("/user", user);
app.use("/posts", posts);

app.get('/', (req, res) => {
    res.send('Hello World');
    });
app.listen(3000, () => {
    console.log('Server is listening on port 3000')
});


