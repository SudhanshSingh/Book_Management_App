const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "string") return true
}

const createReview = async function (req, res) {
    try {
        let data = req.body;
        let bookId = req.params.bookId

        if (!bookId) return res.status(400).send({ status: false, message: "please enter bookId" })
        if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({status:false,message:"provide valid bookId"})

        let checkId = await bookModel.findById({ _id: bookId })

        if (!checkId) return res.status(404).send({ status: false, message: "no such book" })
        if (checkId.isDeleted == true) return res.status(404).send({ status: false, message: "this book is deleted" })

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data" })

        let { review, reviewedBy, rating } = data
        if (review) {
            if (!isValid(review)) return res.status(400).send({ status: false, message: "enter valid review" })
        }

        if(reviewedBy) {
            if(!(/^[a-zA-Z,\-.\s]*$/.test(reviewedBy))) return res.status(400).send({ status: false, message: "provide a valid name in reviewedBy field" });
            if(!isValid(reviewedBy)) return res.status(400).send({status:false,message:"enter valid name"})
        }

        if (!rating) return res.status(400).send({ status: false, message: "enter rating" })
        if (!(/^[0-5](\.[0-9][0-9]?)?$/.test(rating))) return res.status(400).send({ status: false, message: "provide a valid rating" });
        if (typeof rating !== "number") return res.status(400).send({ status: false, message: "enter valid rating" })
        // console.log(checkId.reviews)
        let reviewData = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: Date.now(),
            rating: rating,
            review: review
        }
        
        let newReview = await reviewModel.create(reviewData)

        let bookUpdate = await bookModel.findByIdAndUpdate({ _id: bookId }, { reviews: checkId.reviews + 1 }, { new: true })
        let showData = {...bookUpdate._doc,reviewData:[newReview]}
        res.status(200).send({ status: true, message: "review created", data: showData})

    } catch (err) {
        return res.status(500).send({ status: false, mag: err.message })

    }
}

const updateReview = async function (req, res) {
    try {
    
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!bookId) return res.status(400).send({ status: false, message: "please enter bookId" })
        if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({status:false,message:"provide valid bookId"})
        let checkId = await bookModel.findById({ _id: bookId })
        if (!checkId) return res.status(404).send({ status: false, message: "no such book" })
        if (checkId.isDeleted == true) return res.status(404).send({ status: false, message: "this book is deleted" })

        if (!reviewId) return res.status(400).send({ status: false, message: "please enter reviewId" })
        if(!mongoose.isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"provide valid reviewId"})
        let checkreview = await reviewModel.findById({ _id: reviewId })
        if (!checkreview) return res.status(404).send({ status: false, message: "no such review" })
        if (checkreview.isDeleted == true) return res.status(404).send({ status: false, message: "this review is deleted" })

        if(!Object.keys(req.body).length) return res.status(400).send({ status: false, message: "please provide data to update" })

        let{review, reviewedBy, rating}= req.body

        if (review) {
            if (!isValid(review)) return res.status(400).send({ status: false, message: "enter valid review" })
        }

        if(reviewedBy) {
            if(!(/^[a-zA-Z,\-.\s]*$/.test(reviewedBy))) return res.status(400).send({ status: false, message: "provide a valid name in reviewedBy field" });
            if(!isValid(reviewedBy)) return res.status(400).send({status:false,message:"enter valid name"})
        }

        if (rating) {
        if (!(/^[0-5](\.[0-9][0-9]?)?$/.test(rating))) return res.status(400).send({ status: false, message: "provide a valid rating" });
        if (typeof rating !== "number") return res.status(400).send({ status: false, message: "enter valid rating" })
        }

        let updateDoc = await reviewModel.findOneAndUpdate({
            _id: reviewId
        }, {
            $set: {
                review: review,
                reviewedBy : reviewedBy,
                rating: rating
            }
        }, { new: true })

        res.status(200).send({ status: true, message: "review created", data: {...checkId._doc,reviewData:[updateDoc]}})

    } catch (err) {
        return res.status(500).send({ status: false, mag: err.message })

    }
}


const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        // console.log(bookId,reviewId)

        if (!bookId) return res.status(400).send({ status: false, message: "please enter bookId" })
        if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({status:false,message:"provide valid bookId"})
        let checkId = await bookModel.findById({ _id: bookId })
        if (!checkId) return res.status(404).send({ status: false, message: "no such book" })
        if (checkId.isDeleted == true) return res.status(404).send({ status: false, message: "this book is deleted" })

        if (!reviewId) return res.status(400).send({ status: false, message: "please enter reviewId" })
        if(!mongoose.isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"provide valid reviewId"})
        let checkreview = await reviewModel.findById({ _id: reviewId })
        if (!checkreview) return res.status(404).send({ status: false, message: "no such review" })
        if (checkreview.isDeleted == true) return res.status(404).send({ status: false, message: "this review is deleted" })

        let Update = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: Date.now() }, { new: true });

        let bookUpdate = await bookModel.findByIdAndUpdate({ _id: bookId }, { reviews: checkId.reviews - 1 }, { new: true })
        console.log({...bookUpdate._doc,reviewData:[Update]})

        return res.status(200).send({ status: true, message: "successfully deleted book", });

    } catch (err) {
        return res.status(500).send({ status: false, mag: err.message })

    }
} 


module.exports = { createReview, updateReview, deleteReview }