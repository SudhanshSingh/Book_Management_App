const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";




// login user
const loginUser = async function(req, res) {
    try {
        const data = req.body;
        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "Invalid request parameters. Please provide login details" });
        }

        // Extract parameter 
        let { email, password } = data

        // valitaion start to here 
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is required for login" });
        }
        // Email validation whether it is entered perfect or not.
        email = email.trim();
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            res.status(400).send({ status: false, msg: "Enter valid email address." })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is mandatory for login" });
        }
        // Validations ends

        const findUser = await userModel.findOne({ email, password });
        //finding user details in DB
        if (!findUser) {
            return res.status(400).send({ status: false, msg: "Invalid credentials. Please check the details & try again." })
        }

        //creating JWT
        let token = jwt.sign({ userId: findUser._id.toString() }, secretKey);
        req.header("x-api-key", token);
        return res.status(201).send({ status: true, token: token });


    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }

}
module.exports = { createUser, loginUser }
