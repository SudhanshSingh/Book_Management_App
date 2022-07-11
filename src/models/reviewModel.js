const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    bookId:{
        type: mongoose.Types.ObjectId,
        ref: "Book",
        required: true
    },
    reviewedBy: {
        type: String,
        //required: true,
        default: "Guest",
        trim: true
    },
    reviewedAt:{
        type:Date,
        required:true
      },
    rating: {
        type: Number,
        required: true,

    },
    review:{
        type:String
    },
    isDeleted:{
        type: Boolean,
        default: false
    }


})   //,{ timestamps: true });

module.exports = mongoose.model('Review', reviewSchema)