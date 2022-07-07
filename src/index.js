const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer")
const route = require('./route/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

app.use(multer().any())


mongoose.connect("mongodb+srv://Dipen1234:jVP8pyAv3s3NzEM3@cluster0.dkmbl.mongodb.net/Project-3-group75Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err))

app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});