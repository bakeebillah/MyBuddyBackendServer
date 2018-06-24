"use strict";

const express = require('express');
const router = express.Router();

const SubscriptionController = require('../controllers/subscriptionController');

router.get('/', SubscriptionController.list);
// router.post('/', SubscriptionController.subscribe);

module.exports = router;