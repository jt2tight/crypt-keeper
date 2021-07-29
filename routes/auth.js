const path = require('path');
const { check, body } = require('express-validator');

const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const isLoggedIn = require('../middleware/is-logged-in');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', 
    check('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength( { min: 6}).withMessage('Password must be a minimum of 6 characters.'), 
    body('confirmPassword').custom((value, { req })=> {
    if (value !== req.body.password) {
        throw new Error('Passwords have to match');
    }
    return true
    }).withMessage('Passwords have to match'), 
    authController.postSignup);

router.get('/login', isLoggedIn, authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/log-out', authController.getLogout);

router.get('/reset-password', authController.getReset);

router.post('/reset-password', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword)

module.exports = router; 