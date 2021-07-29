const User = require('../models/user');
const Coin = require('../models/coins');
const { validationResult } = require('express-validator/check');

exports.getPortfolio = (req, res, next) => {

    const userId = req.user._id; 
    let userCoin;

    User.findById(userId)
    .then(user => {
        userCoin = user.portfolio.items;
        
        return res.render('portfolio/portfolio', {
            userCoin: userCoin,
            user : user,
            path:'/portfolio',
            pageTitle:'Crypt Keeper'                
        })
        
    })
    .catch(err => {
        console.log(err)
    })

};

exports.getCoinList = (req,res,next) => {

    Coin.find()
    .then(items => {
        res.render('portfolio/coin-list',{
            coins: items,
            path:'/coin-list',
            pageTitle:'Add Coins'
        })

    })
    .catch(err => console.log(err));
    
};

exports.getAddCoin = (req,res,next) => {
    const _coinId = req.params.coindId;

    Coin.findById(_coinId)
    .then(coin => {
        res.render('portfolio/add-coin',{
            coin: coin,
            path:'/coin-list/add-coin',
            pageTitle: 'Add Coin',
            errorMessage: req.flash('error')
        })

    })
    .catch(err => console.log(err));
    
};


exports.postAddCoin = (req, res, next) => {
    const coinQuantity = req.body.quantity; 
    const coinId = req.body.coinId;
    const price = req.body.price;
    const date = req.body.date;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        Coin.findById(coinId)
        .then(coin => {
            return res.status(404).render('portfolio/add-coin',{
                coin: coin,
                path:'/coin-list/add-coin',
                pageTitle: 'Add Coin',
                errorMessage: errors.array()[0].msg
    
            });

        })
        .catch(err => {
            console.log(err);
        })
        
    }

    Coin.findById(coinId)
      .then(coin => {
        req.user.addCoinTransaction(coin, coinQuantity, price, date);   
      })
      .then(result => {
        res.redirect('/portfolio');
      })
      .catch(err => console.log(err));

  };

exports.getRemoveCoin = (req,res,next) => {

    const _coinId = req.params.coindId;

    Coin.findById(_coinId)
    .then(coin => {
        res.render('portfolio/remove-coin',{
            coin: coin,
            path:'/coin-list/remove-coin',
            pageTitle: 'Remove Coin',
            errorMessage: req.flash('error')
        })

    })
    .catch(err => console.log(err));
    
};



exports.postRemoveCoin = (req,res,next) => {
    const name = req.body.name;
    const coinId = req.body.coinId;
    const coinQuantity = req.body.quantity; 
    const price = req.body.price;
    let date = req.body.date;
    const errors = validationResult(req);
    
    Coin.findById(coinId)    
    .then(coin => {
        if(!errors.isEmpty()){
            return res.status(404).render('portfolio/remove-coin',{
                coin: coin,
                path:'/coin-list/remove-coin',
                pageTitle: 'Remove Coin',
                errorMessage: errors.array()[0].msg
    
            });

        } else {
            req.user.removeCoinQuantity(coinId, name, coinQuantity, price, date);
            return res.redirect('/portfolio');
        }    
    })
    .catch(err => console.log(err));     

};

exports.getDeleteCoin = (req,res,next) => {
    const _coinId = req.params.coinId;

    Coin.findById(_coinId)
    .then(coin => {
        res.render('portfolio/delete-coin', {
            coin: coin,
            path:'/portfolio/delete-coin',
            pageTitle: 'Confirm Delete'
        })
    })
    .catch(err => console.log(err))

    
};

exports.postDeleteCoin = (req,res,next) => {
    const coinId = req.params.coinId;

    req.user.deleteCoin(coinId);

    res.redirect('/portfolio');
}


exports.getTransactions = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const userId = req.user._id; 
    let userCoin;
    let transactions;

    User.findById(userId)
    .then(user => {
        userCoin = user.portfolio.items;
        transactions = user.transactions.items; 
        
        return res.render('portfolio/transactions', {
            userCoin: userCoin,
            transactions: transactions,
            user : user,
            path:'/portfolio/transactions',
            pageTitle:'Crypt Keeper - Portfolio Transactions'                
        })
        
    })
    .catch(err => {
        console.log(err)
    })

};


exports.getCoinAction = (req,res,next) => {
    const _coinId = req.params.coinId;

    Coin.findById(_coinId)
    .then(coin => {
        res.render('portfolio/coin-action',{
            coin: coin,
            coinId: coin._id,
            path:'/portfolio/action',
            pageTitle: 'Select Action'
        })

    })
    .catch(err => console.log(err));
    
};




