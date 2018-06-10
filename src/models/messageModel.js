const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        body: {
            type: String
        },
        author: [{
            type: mongoose.Schema.Types.ObjectId,
            name: String,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('messageModel', MessageSchema);
