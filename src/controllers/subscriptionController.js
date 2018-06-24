"use strict";

const SubscriptionModel = require('../models/subscriptionModel');
const UserModel = require('../models/userModel');

const subscribe = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).exec()
        .then(movie => res.status(200).json(movie))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const list = (req, res) => {
    SubscriptionModel.find({}).exec()
        .then(subscriptions => res.status(200).json(subscriptions))
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message

            })
        });
};


module.exports = {
    subscribe,
    list
};