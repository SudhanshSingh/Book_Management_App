const mongoose = require("mongoose")
const bookModel= require("../models/bookModel")
const reviewModel = require("../models/reviewModel");



//validation function 
const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidData = function(data) {
    return Object.keys(data).length > 0
        //will return an array of all keys. so, we can simply get the length of an array with .length
}



const Makereview = async function (req,res){
    let data = req.body
    let savedData = await reviewModel.create(data)
    res.send({message:savedData})
}
const findReview = async function  (req,res){
    let gotData = await reviewModel.find()
    res.send({ message: gotData });
}
const getreview = async function (req, res) {
    let specificData = await reviewModel.find().populate("bookId")
    res.send({data: specificData})

}

const updateReview = async function(req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length==0) return res.status(400).send({ status: false, message: "please provide data to update" })

        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "provide bookId" })
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })

        const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        console.log(bookData)

        if (!bookData) {
            return res.status(404).send({ message: "book doesnot exist or already deleted" });
        }


        
        if (data.review) {
            if (!isValid(data.review)) {
                return res.status(400).send({ status: false, message: "please provide correct review" })
            }
        }

        if (data.rating) {
            if (!isValid(data.rating)) {
                return res.status(400).send({ status: false, message: "please provide  proper rating  " })
            }  
        }

        if (data.reviewedBy) {
            if (!isValid(data.reviewedBy) ) {
                return res.status(400).send({ status: false, message: "please provide reviewer's name" })
            }
          
        }  
        let reviewId = req.params.reviewId
        if (!reviewId) return res.status(400).send({ status: false, message: "provide reviewId" })
        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" }) 

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false },
            {
                $set: {
                    review: data.review,
                    rating: data.rating,
                    reviewedBy:data.reviewedBy   
                }
            }, 
            { new: true })
            
        res.status(200).send({ message: "successfully updated", data: updatedReview});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


    module.exports = {Makereview,findReview,getreview,updateReview}
    




