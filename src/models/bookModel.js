const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type :String, 
       
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
        ref : "User"
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
    bookCover:{
        type: String
    }


},{ timeStamps :true})

module.exports = mongoose.model("Book",bookSchema)

