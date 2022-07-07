const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isValid = function (value) {
    if (typeof (value) === "undefined" || typeof (value) === null) return false;
    if (typeof (value) === "string" && value.trim().length === 0) return false;
    if (typeof (value) === "string") return true;

}


// Creating User request handler:-


const createUser = async function (req, res) {
    try {
        let userData = req.body;
        if (Object.keys(userData).length == 0) { return res.status(400).send({ status: false, message: "UserData can't be empty" }); }

        if (!userData.title) { return res.status(400).send({ status: false, message: "Please include a title" }) };
        // if (!isValid(userData.title)) return res.status(400).send({ status: false, message: "Title is required." }); 
        let arr = ["Mr", "Mrs", "Miss"]
        let titleCheck = arr.includes(userData.title)
        if (!titleCheck) return res.status(400).send({ status: false, message: "Enter a valid title-Mr,Mrs,Miss" })
        if (!userData.name) return res.status(400).send({ status: false, message: "Please include the name" });
        if (!isValid(userData.name)) { return res.status(400).send({ status: false, message: "Name is required." }); }

        if (!userData.phone) return res.status(400).send({ status: false, message: "phone number must be present" })
        if (!(/^[6-9]{1}[0-9]{9}$/im.test(userData.phone))) return res.status(400).send({ status: false, message: "Phone number is invalid." })
        //if (!isValid(userData.phone)) { return res.status(400).send({ status: false, message: "Phone number is required." }); }
        if ((userData.phone).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces from phone number" }); } }
        const uniqueMobile = await userModel.findOne({ phone: userData.phone })
        if (uniqueMobile) return res.status(400).send({ status: false, message: "Phone number already exists." })

        if (!userData.email) { return res.status(400).send({ status: false, message: "Please include an email" }) };
        if (!isValid(userData.email)) { return res.status(400).send({ status: false, message: "Email is required" }); }
        const vaildEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(userData.email)
        if (!vaildEmail) return res.status(400).send({ status: false, message: "Email is invalid.Please use correct EmailId" })
        if ((userData.email).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces in email" }); } }
        let emailOld = await userModel.findOne({ email: userData.email })
        if (emailOld) { { return res.status(400).send({ status: false, message: "email already exists" }) } }

        if (!userData.password) { return res.status(400).send({ status: false, message: "Please include a password" }) };
        if (!isValid(userData.password)) { return res.status(400).send({ status: false, message: "password is required." }); }
        if ((userData.password).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces in password" }); } }
        if (!((userData.password.length >= 8) && (userData.password.length < 15))) { return res.status(400).send({ status: false, message: "Password should be in 8-15 character" }) }

        if (Object.keys(userData.address).length == 0) { return res.status(400).send({ status: false, message: "Address can't be empty" }); }
        if (!isValid(userData.address.street)) { return res.status(400).send({ status: false, message: "Street address is not valid address" }); }
        //if ((userData.address.street).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces from Street address" }); } }

        if (!isValid(userData.address.city)) { return res.status(400).send({ status: false, message: "City address is not valid address" }); }
        if ((userData.address.city).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces from City address" }); } }

        if (!isValid(userData.address.pincode)) return res.status(400).send({ status: false, message: "Address pincode  is not valid pincode." });
        if ((userData.address.pincode).includes(" ")) { { return res.status(400).send({ status: false, message: "Please remove any empty spaces from Address pincode" }); } }


        let savedData = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "UserData is successfully created", data: savedData, });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
};



// login user
const loginUser = async function (req, res) {
    try {
        const data = req.body;
        if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "Invalid request parameters. Please provide login details" });

        // Extract parameter 
        let { email, password } = data

        // valitaion start to here 
        if (!isValid(email)) return res.status(400).send({ status: false, msg: "Email is required for login" });
        if (!email) return res.status(400).send({ status: false, msg: "Please include a email" });
        // Email validation whether it is entered perfect or not.
        email = email.trim();
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return res.status(400).send({ status: false, msg: "Enter valid email address." })
        }

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is mandatory for login" });
        if (!password) { return res.status(400).send({ status: false, msg: "Please include a password." }); }
        // Validations ends
        //finding user details in DB
        const findUser = await userModel.findOne({ email, password });
        if (!findUser) return res.status(400).send({ status: false, msg: "Invalid credentials. Please check the details & try again." })

        //creating JWT
        let token = jwt.sign({ userId: findUser._id.toString() }, "Functionup-Radon");
        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true, message: "Token is Created Successfully", token: token });
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }

}
module.exports = { createUser, loginUser }

