const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
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

        if (Object.keys(data).length==1) {
            return res.status(400).send({ status: false, message: "You must enter data" })
        }
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!title) return res.status(400).send({ status: false, message: "You must enter title" })
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "Provide a Valid Title" })
        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) { return res.status(400).send({ status: false, message: "This title is already present" }) }

        if (!excerpt) return res.status(400).send({ status: false, message: "You must enter excerpt" })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "excerpt should not be empty " })

        if (!userId) return res.status(400).send({ status: false, message: "You must enter userId" })
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "userId  is not valid " })
        let checkUserId = await userModel.findOne({ userId })
        if (!checkUserId) { return res.status(400).send({ status: false, message: " please register. not a valid user. " }) }

        if (!ISBN) return res.status(400).send({ status: false, message: "You must enter ISBN" })
        if(!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))) return res.status(400).send({ status: false, message: "Please Provide Valid ISBN" })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN should not be empty" })
        let checkISBN = await bookModel.findOne({ ISBN })
        if (checkISBN) { return res.status(400).send({ status: false, message: "This ISBN is already present" }) }

        if (!category) return res.status(400).send({ status: false, message: "category is required" })
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category should not be empty" })

        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is required" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "You must enter releasedAt" })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, msg: "releasedAt should not be empty" })
        if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) return res.status(400).send({status:false,message:`provide proper formate = yyyy-mm-dd`})
        // console.log(userId,data.tokenId)

        if (userId != data.tokenId) return res.status(400).send({ status: false, message: "You are unauthorized" })


        // if (!isValid(subcategory)) {
        //     return res.status(400).send({ status: false, msg: "subcategory should not be empty" })
        // }
        let reqData = {
            title:title,
            excerpt:excerpt,
            userId:userId,
            ISBN:ISBN,
            category:category,
            subcategory:subcategory,
            releasedAt:releasedAt
        }
        let created = await bookModel.create(reqData)
        res.status(201).send({ status: true, message: 'Successfully Book Data is Created', data: created })
    }
    catch (err) {
        return res.status(500).send({ status: false, mag: err.message })

    }
}




const getBooks = async function (req, res) {
    try {
        let query = req.query

        if (query.userId) {
            if (!mongoose.isValidObjectId(query.userId)) return res.status(400).send({ status: false, msg: "userId  is not valid " })
        }

        if (query.category) {
            if (!isValid(query.category)) return res.status(400).send({ status: false, msg: "category should not be empty" })
        }

        if (query.subcategory) {
            if (!isValid(query.subcategory)) return res.status(400).send({ status: false, msg: "subcategory should not be empty" })
        }

        let allBooks = await bookModel.find({ $and: [query, { isDeleted: false }] }).collation({ locale: "en" }).sort({ "title": 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
        if (allBooks.length == 0) return res.status(404).send({ status: false, message: "no such book" })

        res.status(200).send({ status: true, message: "successfully Show the all books", data: allBooks })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




/////////////////////////////////// GET /books/:bookId   ////////////////////////
const getById = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!bookId) return res.status(400).send({ status: false, message: "Enter BookId in the params" });
        // validating the BookId
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "BookId  is not valid " })
        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false, });
        console.log({...findBook})
        if (!findBook) return res.status(404).send({ status: false, message: "Book is not found" });

        let reviews= await reviewModel.find({bookId:bookId,isDeleted:false})
        // console.log(reviews)

        let bookData = {...findBook._doc,reviewsData:reviews}
        return res.status(200).send({ status: true, message: "booklist", data: bookData  });
        
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message });
    }
};




const updateById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "provide bookId" })
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
        let checkId = await bookModel.findById({ _id:bookId })
        if (!checkId) return res.status(400).send({ status: false, message: "no such Book" })
        if (checkId.isDeleted == true) return res.status(404).send({ status: false, message: "Book is already deleted" })

        if (Object.keys(req.body).length==1) return res.status(400).send({ status: false, message: "please provide data to update" })

        let { title, excerpt, releasedAt, ISBN } = req.body

        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, msg: "title should not be empty" })
            let checkTitle = await bookModel.findOne({ title })
            if (checkTitle) { return res.status(400).send({ status: false, message: "This title is already present" }) }
        }

        if (excerpt) {
            if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "excerpt should not be empty " })
        }

        if (ISBN) {
            if (!ISBN) return res.status(400).send({ status: false, message: "You must enter ISBN" })
            if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN should not be empty" })
            let checkISBN = await bookModel.findOne({ ISBN })
            if (checkISBN) { return res.status(400).send({ status: false, message: "This ISBN is already present" }) }
        }

        let updateBook = await bookModel.findOneAndUpdate({
            _id: bookId
        }, {
            $set: {
                title: title,
                excerpt: excerpt,
                releasedAt: releasedAt,
                ISBN: ISBN
            }
        }, { new: true })
        res.status(200).send({ status: true, message: "Book updated", data: updateBook })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}


const deleteBookById = async function (req, res) {

    try {
        let bookId = req.params.bookId;
        if (!bookId) return res.status(400).send({ status: false, message: " BookId must be present." });
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: " BookId is invalid." });

        let data = await bookModel.findById({ _id:bookId });
        if (!data) return res.status(400).send({ status: false, message: "No such book found" })

        if (data.isDeleted == true) return res.status(400).send({ status: false, msg: "data already deleted" })

        let Update = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: Date() }, { new: true });
        console.log(Update)
        return res.status(200).send({ status: true, message: "successfully deleted book", });
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}
module.exports = { createBook, getBooks, getById, updateById, deleteBookById }

