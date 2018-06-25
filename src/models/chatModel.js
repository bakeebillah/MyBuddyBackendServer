"use strict";

var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
    id: {
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
        new mongoose.Schema(
            {
                id: {
                    type: String,
                    required: true,
                    unique: true
                },
                message: {
                    type: String,
                    required: true
                },
                sender: {
                    type: String,
                    require: true
                }
            }
        )
    ]
    ,
    users: [
        String
    ]

})

module.exports = mongoose.model('chat', ChatSchema);