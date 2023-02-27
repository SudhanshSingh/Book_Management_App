const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer")
const route = require('./route/route.js');
const mongoose = require('mongoose');
const cors=require('cors')
const app = express();

app.use(bodyParser.json());
app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


mongoose.connect("mongodb+srv://Sudhanshu_09:5JQhJtJ5mUWQIBwo@cluster0.kt4fu.mongodb.net/bookmamagement", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err))

app.use('/', route)

app.use((req,res,next)=>{
    res.status(404).send({status:404, msg:`Not found ${req.url}`})
    next()
})


app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});