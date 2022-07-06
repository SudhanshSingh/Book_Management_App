











const getBooks = async function (req, res) {
    try {
       let query = req.query
       let allBooks = await bookModel.find({ $and: [query, { isDeleted: false}] },{sort:title}).select({title: 1,excerpt: 1,userId: 1,category: 1,reviews: 1,releasedAt:1})
       if (allBooks.length == 0) return res.status(404).send({status:false, message: "no such blog" })
       res.status(200).send({ status: true, message:"success", data: allBooks })
    }
    catch (error) {
       res.status(500).send({ status: false, msg: error.message })
    }
 
 }