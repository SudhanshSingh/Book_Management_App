const  express  = require("express");
const userController = require("../controllers/userController");
//const reviewController = require("../controllers/reviewController")
const bookController = require("../controllers/bookController")
const middleWare = require("../middleWare/auth")
const router = express.Router();


router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)

router.post("/books", middleWare.authenticate, middleWare.authorize, bookController.createBook)

router.get("/books", middleWare.authenticate, bookController.getBooks)


router.get("/books",bookController.deleteBookById)

router.get("/books",bookController.getDetails)

router.put("/books/:bookId",bookController.updateBook)




module.exports = router










