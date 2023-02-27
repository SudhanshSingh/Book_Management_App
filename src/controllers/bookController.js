const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");

const aws = require("aws-sdk");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string") return true;
};

////////////////////////////////////////////////////-----CREATE BOOK-------//////////////////////////////////////////////////////////////////
const createBook = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "You must enter data" });
    }
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;

    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "You must enter title" });
    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "Provide a Valid Title" });
    let checkTitle = await bookModel.findOne({ title });
    if (checkTitle) {
      return res
        .status(400)
        .send({ status: false, message: "This title is already present" });
    }

    if (!excerpt)
      return res
        .status(400)
        .send({ status: false, message: "You must enter excerpt" });
    if (!isValid(excerpt))
      return res
        .status(400)
        .send({ status: false, message: "Provide a Valid Excerpt" });

    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "You must enter userId" });
    if (!isValid(userId))
      return res
        .status(400)
        .send({
          status: false,
          message: "userId should not be empty & put it in  a string",
        });
    if (!mongoose.isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "userId  is not valid " });
    let checkUserId = await userModel.findOne({ _id: userId });
    if (!checkUserId) {
      return res
        .status(400)
        .send({
          status: false,
          message: " please register. not a valid user. ",
        });
    }

    if (!ISBN)
      return res
        .status(400)
        .send({ status: false, message: "You must enter ISBN" });
    if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Valid ISBN" });
    if (!isValid(ISBN))
      return res
        .status(400)
        .send({ status: false, message: "ISBN should not be empty" });
    let checkISBN = await bookModel.findOne({ ISBN });
    if (checkISBN) {
      return res
        .status(400)
        .send({ status: false, message: "This ISBN is already present" });
    }

    if (!category)
      return res
        .status(400)
        .send({ status: false, message: "category is required" });
    if (!isValid(category))
      return res
        .status(400)
        .send({
          status: false,
          message: "category should not be empty & put it in a string",
        });

    if (!subcategory)
      return res
        .status(400)
        .send({ status: false, message: "subcategory is required" });
    if (!isValid(subcategory))
      return res
        .status(400)
        .send({
          status: false,
          message: "Subcategory should not be empty & put it in a string",
        });

    if (!releasedAt)
      return res
        .status(400)
        .send({ status: false, message: "You must enter releasedAt" });

    if (!isValid(releasedAt))
      return res
        .status(400)
        .send({
          status: false,
          message: "releasedAt should be in string & not empty",
        });
    if (
      !/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt)
    )
      return res
        .status(400)
        .send({
          status: false,
          message: `provide proper formate = yyyy-mm-dd`,
        });

    if (userId != data.tokenId)
      return res
        .status(400)
        .send({ status: false, message: "You are unauthorized" });

    let reqData = {
      title: title,
      excerpt: excerpt,
      userId: userId,
      ISBN: ISBN,
      category: category,
      subcategory: subcategory,
      releasedAt: releasedAt,
    };
  
    aws.config.update({
      accessKeyId: "AKIAY3L35MCRZNIRGT6N",
      secretAccessKey: "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",
      region: "ap-south-1"
  });
  

    let uploadFile = async (file) => {
      return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" });

        var uploadParams = {
          ACL: "public-read",
          Bucket: "classroom-training-bucket",
          Key: "bookApp/" + file.originalname,
          Body: file.buffer,
        };

        s3.upload(uploadParams, function (err, data) {
          if (err) {
            return reject({ error: err });
          }
          // console.log(data);
          console.log("file uploaded succesfully");
          return resolve(data.Location);
        });
      });
    };
    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile(files[0]);
      reqData.bookCover = uploadedFileURL;
      let created = await bookModel.create(reqData);
      res
        .status(201)
        .send({
          status: true,
          message: "Successfully Book Data is Created",
          data: created,
        });
    } else {
      res.status(400).send({ msg: "No file found" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, message: err.message });
  }
};

///////////////// Get Book Api ////////////////////////////////
const getBooks = async function (req, res) {
  try {
    let query = req.query;
    console.log(query)

    if (query.userId) {
      if (!mongoose.isValidObjectId(query.userId))
        return res
          .status(400)
          .send({ status: false, message: "userId  is not valid " });
    }

    if (query.category) {
      if (!isValid(query.category))
        return res
          .status(400)
          .send({ status: false, message: "category should not be empty" });
    }

    if (query.subcategory) {
      if (!isValid(query.subcategory))
        return res
          .status(400)
          .send({ status: false, message: "subcategory should not be empty" });
    }

    let allBooks = await bookModel
      .find({ $and: [query, { isDeleted: false }] })
      .collation({ locale: "en" })
      .sort({ title: 1 })
      .select({
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        reviews: 1,
        releasedAt: 1,
      });
    if (allBooks.length == 0)
      return res.status(404).send({ status: false, message: "no such book" });

    res
      .status(200)
      .send({ status: true, message: "Books list", data: allBooks });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

/////////////////////////////////// GET /books/:bookId   ////////////////////////
const getById = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId)
      return res
        .status(400)
        .send({ status: false, message: "Enter BookId in the params" });
    // validating the BookId
    if (!mongoose.isValidObjectId(bookId))
      return res
        .status(400)
        .send({ status: false, message: "BookId  is not valid " });
    let findBook = await bookModel.findOne({ _id: bookId });
    if (!findBook)
      return res
        .status(404)
        .send({ status: false, message: "Book is not found" });
    if (findBook.isDeleted == true)
      return res
        .status(404)
        .send({ status: false, message: "Book is already deleted" });

    let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false });

    let bookData = { ...findBook._doc, reviewsData: reviews };
    return res
      .status(200)
      .send({ status: true, message: "booklist", data: bookData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateById = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId)
      return res.status(400).send({ status: false, message: "provide bookId" });
    if (!mongoose.isValidObjectId(bookId))
      return res.status(400).send({ status: false, message: "invalid BookId" });
    let checkId = await bookModel.findById({ _id: bookId });
    if (!checkId)
      return res.status(404).send({ status: false, message: "no such Book" });
    if (checkId.isDeleted == true)
      return res
        .status(404)
        .send({ status: false, message: "Book is already deleted" });

    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "please provide data to update" });

    let { title, excerpt, releasedAt, ISBN } = req.body;

    if (title == "")
      return res
        .status(400)
        .send({ status: false, message: "title can't be empty" });
    if (title) {
      if (!isValid(title))
        return res
          .status(400)
          .send({
            status: false,
            message: "title should be in string & not empty",
          });
      let checkTitle = await bookModel.findOne({ title });
      if (checkTitle) {
        return res
          .status(400)
          .send({ status: false, message: "This title is already present" });
      }
    }

    if (excerpt == "")
      return res
        .status(400)
        .send({ status: false, message: "excerpt can't be empty" });
    if (excerpt) {
      if (!isValid(excerpt))
        return res
          .status(400)
          .send({ status: false, message: "excerpt should not be empty " });
    }

    if (releasedAt == "")
      return res
        .status(400)
        .send({ status: false, message: "releasedAt can't be empty" });
    if (releasedAt) {
      if (!isValid(releasedAt))
        return res
          .status(400)
          .send({
            status: false,
            message: "releasedAt should be in string & not empty",
          });
      if (
        !/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt)
      )
        return res
          .status(400)
          .send({
            status: false,
            message: `provide proper formate = yyyy-mm-dd`,
          });
    }

    if (ISBN == "")
      return res
        .status(400)
        .send({ status: false, message: "ISBN can't be empty" });
    if (ISBN) {
      if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))
        return res
          .status(400)
          .send({ status: false, message: "Please Provide Valid ISBN" });
      if (!isValid(ISBN))
        return res
          .status(400)
          .send({ status: false, message: "ISBN should not be empty" });
      let checkISBN = await bookModel.findOne({ ISBN });
      if (checkISBN) {
        return res
          .status(400)
          .send({ status: false, message: "This ISBN is already present" });
      }
    }

    let updateBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        $set: {
          title: title,
          excerpt: excerpt,
          releasedAt: releasedAt,
          ISBN: ISBN,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .send({ status: true, message: "Book updated", data: updateBook });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err.message });
  }
};

const deleteBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId)
      return res
        .status(400)
        .send({ status: false, message: " BookId must be present." });
    if (!mongoose.isValidObjectId(bookId))
      return res
        .status(400)
        .send({ status: false, message: " BookId is invalid." });

    let data = await bookModel.findById({ _id: bookId });
    if (!data)
      return res
        .status(404)
        .send({ status: false, message: "No such book found" });

    if (data.isDeleted == true)
      return res
        .status(404)
        .send({ status: false, message: "data already deleted" });

    let Update = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { isDeleted: true, deletedAt: Date() },
      { new: true }
    );
    console.log(Update);
    return res
      .status(200)
      .send({ status: true, message: "successfully deleted book" });
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message });
  }
};
module.exports = { createBook, getBooks, getById, updateById, deleteBookById };
