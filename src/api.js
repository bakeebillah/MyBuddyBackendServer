"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./configaration');
const middleware = require('./middleware');
const auth = require('./routes/authenticationRouter');


const api = express();


// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended:false}));
api.use(middleware.allowCrossDomain);


// Basic Route
api.get('/',(req,res)=>{
    res.json({
        name:config.basicRouteMessage
    });
});

// api routes
api.use('/auth',auth);


module.exports = api;
