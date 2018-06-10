const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
        chatID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        body: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }],
        charPartner: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }]
    });

module.exports = mongoose.model('chatModel', ChatSchema);
