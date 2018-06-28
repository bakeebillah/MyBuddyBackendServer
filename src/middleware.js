"use strict";
const config = require('./configaration');
const jsonWebToken    = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization, x-access-token');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {
    // check header or url parameters or post parameters for token
    const token = req.headers['x-access-token'];
    if (!token)
        return res.sendStatus(401).send({
            error: 'Unauthorized',
            message: 'No token provided in the request'
        });
    // verifies secret and checks exp
    jsonWebToken.verify(token, config.JwtSecret, (err, decoded) => {
        if (err) return res.sendStatus(401).send({
            error: 'Unauthorized',
            message: 'Failed to authenticate token.'
        });
        // if everything is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.sendStatus(500);
    res.render('error', { error: err })
};

const createChat = ({messages = [], name = "", users = []} = {}) => ({
        id: uuidv4(),
        name,
        messages,
        users,
    }
)

const createMessage = ({message = "", sender = ""} = {}) => ({
        id: uuidv4(),
        time: getTime(new Date(Date.now())),
        message,
        sender
    }
)

const getTime = (date)=>{
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
    allowCrossDomain,
    checkAuthentication,
    errorHandler,
    createChat,
    createMessage,
};