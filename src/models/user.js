"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
    /*
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: date,
        require: true
    },
    street: {
        type: String,
        require: true
    },
    streetnumber: {
        type: Number,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }
    */



});





var User = mongoose.model('User', UserSchema);
module.exports = User;