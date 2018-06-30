"use strict";

const express = require('express');
const router = express.Router();
const middleware    = require('../middleware');

const RatingController = require('../controllers/ratingController');

router.post('/setRating' , RatingController.setRating);

module.exports = router;