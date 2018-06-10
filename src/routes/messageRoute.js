"use strict";
const express = require('express');
const router = express.Router();
const middleware    = require('../middleware');
const authController = require('../controllers/authenticationController');
const messageController = require('../controllers/chatController');

router.get('/message/:recipientID', messageController.getChat);

module.exports =router;