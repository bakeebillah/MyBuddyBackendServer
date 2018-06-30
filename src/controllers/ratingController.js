"use strict";

const ratingModel = require('../models/ratingModel');

const setRating = (request, response) => {

    if(request.body.sender && request.body.receiver && request.body.comment && request.body.rating) {

        let sender = request.body.sender;
        let receiver = request.body.receiver;
        let comment = request.body.comment;
        let rating = request.body.rating;

        const ratingObject = Object.assign(
            {sender: sender},
            {receiver: receiver},
            {comment: comment},
            {rating: rating});

        ratingModel.create(ratingObject)
            .then(ratingObject => {
                return response.status(200).json({
                    status: 'success',
                    rating: {
                        sender: sender,
                        receiver: receiver,
                        comment: comment,
                        rating: rating
                    }
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

module.exports = { setRating };