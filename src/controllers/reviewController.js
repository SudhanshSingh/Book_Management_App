const userModel = require("../models/userModel")
const bookModel= require("../models/bookModel")

const reviewModel = require("../models/reviewModel");


const Makereview = async function (req,res){
    let data = req.body
    let savedData = await reviewModel.create(data)
    res.send({msg:savedData})
}
const findReview = async function  (req,res){
    let gotData = await reviewModel.find()
    res.send({ msg: gotData });
}
const getreview = async function (req, res) {
    let specificData = await reviewModel.find().populate("bookId")
    res.send({data: specificData})

}



module.exports.Makereview =Makereview
module.exports.findReview=findReview
module.exports.getreview=getreview