const path = require('path');
const { check, body } = require('express-validator');
const express = require('express');

const homeController = require('../controllers/home');
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', homeController.getIndex);

router.get('/markets', homeController.getMarkets);

router.post('/', 
        check('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength( { min: 6}).withMessage('Password must be a minimum of 6 characters.'), 
        body('confirmPassword').custom((value, { req })=> {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match');
        }
        return true
        }).withMessage('Passwords have to match'),
    homeController.postSignup);

module.exports = router; 