"use strict";

const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    subscription_id: {
        type: Number
    },
    subscriptionType: {
        type: String,
        required: true,
    },
    pricePerMonth: {
        type: Number,
        required: true,
    },
    pricePerDay: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('subscriptions', SubscriptionSchema);