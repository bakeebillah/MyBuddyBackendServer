"use strict";

const ratingModel = require('../models/ratingModel');
const chatModel = require('../models/chatModel');

const setRating = (request, response) => {

    if(request.body.sender && request.body.receiver && request.body.comment) {

        let sender = request.body.sender;
        let receiver = request.body.receiver;
        let comment = request.body.comment;
        let rating = request.body.rating ? request.body.rating : 0;

        const ratingObject = Object.assign(
            {sender: sender},
            {receiver: receiver},
            {comment: comment},
            {rating: rating});

        ratingModel.create(ratingObject)
            .then(ratingObject => {
                return response.status(200).json({
                    status: 'Success',
                    rating: ratingObject
                });
            })
            .catch(error => {
                if(error.code == 11000) {
                    response.status(400).json({
                        error: 'Rating already exists',
                        message: error.message
                    });
                }
                else{
                    response.status(500).json({
                        error: 'Internal server error',
                        message: error.message
                    });
                }
            });
    }
    else {
        return response.status(400).json({
            error:'Bad Request' ,
            message:'All fields are required.'
        });
    }
};

const getContacts = (request, response) => {
    chatModel.find({}, function(error, chats) {

        if(chats) {
            let contacts = [];

            for (let chat of chats) {
                contacts.push({
                    'id' : chat.id,
                    'name' : chat.users[0]
                });
            }

            response.status(200).json({
                status: 'Success',
                contacts: contacts
            });
        }
        else {
            response.status(200).json({
                status: 'There were not found contacted people',
                contacts: []
            });
        }
    });
};

module.exports = { setRating, getContacts };