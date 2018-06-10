"use strict"
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');


const getChat = function(req, res, next) {
    const userId = req.user._id;
    const recipientId = req.params.recipientId;

    Chat.findOne({ participants: {$all: [ userId, recipientId]}}, function(err, foundConversation) {
        if (err) {
            res.send({
                error: err
            });
            return next(err);
        }
        if (!foundConversation) {
            return res.status(200).json({
                message: 'Could not find conversation'
            })
        }

        Message.find({ conversationId: foundConversation._id })
            .select('createdAt body author')
            .sort('-createdAt')
            .populate('author.item')
            .exec(function(err, message) {
                if (err) {
                    res.send({
                        error: err
                    });
                    return next();
                }

                // Reverse to show most recent messages
                const sortedMessage = message.reverse();

                res.status(200).json({
                    conversation: sortedMessage,
                    conversationId: foundConversation._id
                });
            });
    });
}



module.exports = {
    getChat
};