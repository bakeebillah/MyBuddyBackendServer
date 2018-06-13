"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var ChatSchema = new mongoose.Schema({
    chatID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    messages: [
        String
    ]
    ,
    users: [
        String
    ]

})

module.exports = mongoose.model('chatModel', ChatSchema);