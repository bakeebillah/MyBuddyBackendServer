"use strict";
const express = require('express');
const router = express.Router();
const middleware    = require('../middleware');
const buddyController = require('../controllers/buddyController');


router.post('/buddysearch', middleware.checkAuthentication , buddyController.buddySearch);
//router.post('/buddysearch', buddyController.buddySearch);

module.exports =router;