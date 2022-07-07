<<<<<<< HEAD
=======
//const moment = require("moment")
>>>>>>> 828dab46467c2a7c53b5343b40c7a4b4f15fa5ee
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
<<<<<<< HEAD
    title: {
        type :String, 
        required : "Title is required", 
        unique:true , 
        trim :true
    },
    excerpt: {
        type :String, 
        required : true 
    }, 
    userId: {
        type : ObjectId,
        required :"UserId is required", 
        refs : "User"
    },
    ISBN: {
        type:String, 
        required: "ISBN is required", 
        unique : true
    },
    category: {
        type :String,
        required : "Category is required" 
    },
    subcategory: {
        type :[String], 
        required: "Subcategory is required"
    },
    reviews: {
        type :Number, 
        default: 0
    },
    deletedAt: {
        type :Date 
    }, 
    isDeleted: {
        type :Boolean, 
        default: false
    },
    releasedAt: {
        type :Date,
        required : true 
    },
=======
    title: {type :String, required : "Title is required", unique:true , trim :true},
    excerpt: {type :String, required : "excerpt is required" }, 
    userId: {type : ObjectId, required :"UserId is required" , refs : "User"},
    ISBN: {type:String, required: "ISBN is required", unique : true},
    category: {type :String, required : "Category is required" },
    subcategory: {type :[String], required: "Subcategory is required"},
    reviews: {type :Number, default: 0},
    deletedAt: {type :Date }, 
    isDeleted: {type :Boolean, default: false},
    releasedAt:{ type :String , required : true },
>>>>>>> 828dab46467c2a7c53b5343b40c7a4b4f15fa5ee
},{ timeStamps :true})

module.exports = mongoose.model("Book",bookSchema)

