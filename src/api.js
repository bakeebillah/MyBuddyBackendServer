"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./configaration');
const middleware = require('./middleware');


const auth = require('./routes/authenticationRouter');
const buddy = require('./routes/buddyRouter');
const subscription = require('./routes/subscriptionRouter');
const rating = require('./routes/ratingRouter');

const api = express();

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: false}));
api.use(middleware.allowCrossDomain);


// Basic Route
api.get('/', (req, res) => {
    res.json({
        name: config.basicRouteMessage
    });
});

// api routes
api.use('/auth', auth);
api.use('/buddy', buddy);
api.use('/subscriptions', subscription);
api.use('/ratings', rating);

module.exports = api;


