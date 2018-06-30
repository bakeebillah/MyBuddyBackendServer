"use strict";

let mongoose = require('mongoose');

let RatingSchema = new mongoose.Schema({
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
    },
    rating: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('rating', RatingSchema);