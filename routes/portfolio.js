const path = require('path');
const { check, body } = require('express-validator');
const express = require('express');

const portfolioController = require('../controllers/portfolio');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/portfolio', isAuth, portfolioController.getPortfolio);

router.get('/portfolio/coin-list', isAuth, portfolioController.getCoinList);

router.get('/coin-list/add-coin/:coindId', isAuth, portfolioController.getAddCoin);

router.post('/coin-list/add-coin/:coinId', 
    body('price').isFloat().withMessage('Please enter a price'),
    body('quantity').isFloat().withMessage('Please enter a quantity'),
    body('date').isDate().withMessage('Please enter a date'),
    isAuth, portfolioController.postAddCoin);

router.get('/coin-list/remove-coin/:coindId', isAuth, portfolioController.getRemoveCoin);

router.post('/coin-list/remove-coin/:coindId', 
    body('price').isFloat().withMessage('Please enter a price'),
    body('quantity').isFloat().withMessage('Please enter a quantity'),
    body('date').isDate().withMessage('Please enter a date'),
    isAuth, portfolioController.postRemoveCoin);

router.get('/portfolio/delete-coin/:coinId', isAuth, portfolioController.getDeleteCoin);

router.post('/portfolio/delete-coin/:coinId', isAuth, portfolioController.postDeleteCoin);

router.get('/portfolio/transactions', isAuth, portfolioController.getTransactions);

router.get('/portfolio/action/:coinId', isAuth, portfolioController.getCoinAction);

module.exports = router; 