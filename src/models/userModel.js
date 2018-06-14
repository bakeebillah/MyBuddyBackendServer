"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    isPremiumUser: {
        type: Boolean,
        required: false
    },
    gender:{
        type: String,
        required: false
    },
    country:{
        type: String,
        required: false
    },
    city:{
        type: String,
        required: false
    },
    address:{
        type: String,
        required: false
    },
    mobileNumber:{
        type: String,
        required: false
    },
    knownLanguage:{
        type:String,
        required:false
    },
    firstName:{
        type: String,
        required:false
    },
    lastName:{
        type: String,
        required:false

    }


});





var UserModel = mongoose.model('UserModel', userSchema);
module.exports = UserModel;