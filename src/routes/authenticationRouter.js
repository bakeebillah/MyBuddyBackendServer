"use strict";
const express = require('express');
const router = express.Router();
const middleware    = require('../middleware');
const authController = require('../controllers/authenticationController');

router.post('/login',authController.login);
router.post('/register',authController.register);
router.get('/messageback', authController.messageback);
router.get('/me', middleware.checkAuthentication , authController.me);
router.get('/logout', authController.logout);
router.post('/user/', authController.getUser);

module.exports =router;