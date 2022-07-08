
const  express  = require("express");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController")
const bookController = require("../controllers/bookController")
const router = express.Router();


router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)

router.post("/books",bookController.createBook)

router.get("/books",bookController.getBooks)
router.post("/registers",reviewController.Makereview)
router.get("/reviews",reviewController.findReview)
router.get("/populate",reviewController.getreview)
//router.get("/book",bookController.getBook)
module.exports = router










