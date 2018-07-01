"use strict";
const express = require('express');
const router = express.Router();
const middleware    = require('../middleware');
const authController = require('../controllers/authenticationController');

router.post('/login',authController.login);
router.post('/register',authController.register);
router.get('/me', middleware.checkAuthentication , authController.me);
router.get('/logout', authController.logout);
router.post('/user/', authController.getUser);
router.post('/subs/',middleware.checkAuthentication, authController.getUserSubs);
router.put('/save', authController.updateUser);

module.exports =router;