"use strict";

let mongoose = require('mongoose');

let RatingSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('rating', RatingSchema);