const path = require('path');
const Coin = require('../models/coins');
const DummyCoin = require('../models/dummyCoinInfo');
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.getIndex = (req, res, next) => {
    req.session.pageHome = true; 
    res.render('index',{
        path:'/',
        pageTitle:'Crypt Keeper',
        errorMessage: req.flash('error')
        
    })

};

exports.getMarkets = (req, res, next) => {

    Coin.find()
    .then(item =>{
        res.render('home/markets',{
            coins: item,
            path:'/markets',
            pageTitle:'Crypt Keeper - Market Prices'
        })

    })
    .catch(err => {
        console.log(err);
    })

    
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('authentication/signup',{
            pageTitle: 'Signup', 
            path: '/signup',
            errorMessage: errors.array()[0].msg

        });
    }


    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            req.flash('error','E-mail already exists');
            return res.redirect('/signup');
        }
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    portfolio: { 
                        items: []
                    },
                    transactions: {
                        items: []
                    }
                });
                return user.save()
                .then(result => {
                    res.redirect('/login');
                    return transporter.sendMail({
                                    to: email,
                                    from: 'jvtrezza87@gmail.com',
                                    subject: 'Signup Success!',
                                    html: '<h1>You successfully signed up!</h1>'
                                });
                })
        
            })
            
    })
    .catch(err => console.log(err));        

};