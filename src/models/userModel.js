const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    
    Name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
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
    Phone : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        street: {string},
        city: {string},
        pincode: {string}
      },
        
 },{ timestamps: true })

module.exports = mongoose.model('User', userSchema)
