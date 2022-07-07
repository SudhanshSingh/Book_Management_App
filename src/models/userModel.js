
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
<<<<<<< HEAD
=======
    
>>>>>>> 828dab46467c2a7c53b5343b40c7a4b4f15fa5ee
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    address: {
        street: {type:String},
        city: {type:String},
<<<<<<< HEAD
=======

>>>>>>> 828dab46467c2a7c53b5343b40c7a4b4f15fa5ee
        pincode: {type:String}
      },
        
 },{ timestamps: true })

module.exports = mongoose.model('User', userSchema)
