const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "string") return true

}
////////////////////////////////////////////////////-----CREATE BOOK-------//////////////////////////////////////////////////////////////////
const createBook = async function (req, res) {
    try {
        let data = req.body;

        if (!Object.keys(data).length) {
            return res.status(400).send({ status: false, message: "You must enter data" })
        }
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, } = data
        if (!title) return res.status(400).send({ status: false, message: "You must enter title" })

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "title should not be empty" })
        }
        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) { return res.status(400).send({ status: false, message: "This title is already present" }) }


        if (!excerpt) return res.status(400).send({ status: false, message: "You must enter excerpt" })

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "excerpt should not be empty " })
        }

        if (!userId) return res.status(400).send({ status: false, message: "You must enter excerpt" })


        if (mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "userId  is not valid " })

        let checkUserId = await userModel.findOne({ userId })
        if (!checkUserId) { return res.status(400).send({ status: false, message: " Not valid user , please register" }) }

        if (!category) return res.status(400).send({ status: false, message: "category is required" })

        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "category should not be empty" })
        }

        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is required" })

        // if (!isValid(subcategory)) {
        //     return res.status(400).send({ status: false, msg: "subcategory should not be empty" })
        // }

        let created = await bookModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: created })


    }
    catch (err) {
        return res.status(500).send({ status: false, mag: err.message })

    }
}




const getBooks = async function (req, res) {
    try {
        let query = req.query
        let allBooks = await bookModel.find({ $and: [query, { isDeleted: false }] }, { sort: title }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
        if (allBooks.length == 0) return res.status(404).send({ status: false, message: "no such blog" })
        res.status(200).send({ status: true, message: "success", data: allBooks })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports = (createBook,getBooks)