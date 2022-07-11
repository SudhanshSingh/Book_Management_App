const  express  = require("express");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController")
const bookController = require("../controllers/bookController")
const middleWare = require("../middleWare/auth")
const router = express.Router();


router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)



router.get("/books",bookController.getBooks)
router.post("/registers",reviewController.Makereview)
router.get("/reviews",reviewController.findReview)
router.get("/populate",reviewController.getreview)
//router.get("/book",bookController.getBook)



router.post("/books", middleWare.authenticate, bookController.createBook)

router.get("/books", middleWare.authenticate, bookController.getBooks)

router.get("/books/:bookId",middleWare.authenticate,bookController.getById)

router.put("/books/:bookId",middleWare.authenticate,middleWare.authorize,bookController.updateById)

router.delete("/books/:bookId",middleWare.authenticate,middleWare.authorize,bookController.deleteBookById)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)


module.exports = router










