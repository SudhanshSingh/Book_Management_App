const  express  = require("express");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController")
const bookController = require("../controllers/bookController")
const router = express.Router();




router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)

router.get("/books",bookController.getBooks)


module.exports = router


