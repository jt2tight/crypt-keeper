const path = require('path');
const User = require('../models/user');
const Coin = require('../models/coins');

const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {
    res.status(404).render('authentication/login',{
        path:'/login',
        pageTitle:'Crypt Keeper Login',
        errorMessage: req.flash('error'),

    })
    
};

exports.getLogout = (req, res, next) => {
    res.locals.isAuthenticated = false;
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email})
    .then(user =>{
        if(!user){
            req.flash('error','Invalid E-mail');
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedin = true;
                req.session.user = user; 
                return req.session.save(err => {
                    console.log(err)
                    res.redirect('/portfolio')
                });                
            }
            req.flash('error','Invalid Password');
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        })
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getSignup = (req, res, next) => {
    res.status(404).render('authentication/signup',{
        pageTitle: 'Signup', 
        path: '/signup',
        errorMessage: req.flash('error'),
        
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(404).render('authentication/signup',{
            pageTitle: 'Signup', 
            path: '/signup',
            errorMessage: errors.array()[0].msg

        });
    }

    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            req.flash('error','E-mail already exists')
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


exports.getAddCoin = (req, res, next) => {
    res.status(404).render('admin/add-coin',{
        pageTitle: 'Add Coin', 
        path: '/add-coin',
        
    });
};

exports.postAddCoin = (req, res, next) => {
    const name = req.body.name;
    const abbreviation = req.body.abbreviation;

    Coin.findOne({name: name})
    .then(foundcoin => {
        if(foundcoin){
            return res.redirect('/add-coin');
        }
    
    const coin = new Coin({
        name: name,
        abbreviation: abbreviation
    })
    coin.save()
    })
    .then(result => {
        return res.redirect('add-coin');
    })
    .catch(err => console.log(err));

};




exports.getReset = (req, res, next) => {
    let message = req.flash('error');

    if(message.length > 0){
        message = message[0];
    } else {
        message = null;
    }

    res.status(404).render('authentication/reset', {
        pageTitle: 'Reset Password', 
        path: '/reset-password',
        errorMessage: message

    })
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer)=> {
        if (err) {
            console.log(err)
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                req.flash('error','No account with that e-mail')
                return res.redirect('/reset-password');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
            
        })
        .then(result => {
                res.redirect('/login');
            
                return transporter.sendMail({
                                to: req.body.email,
                                from: 'jvtrezza87@gmail.com',
                                subject: 'Password Reset',
                                html: `<h1>Password Reset Request</h1>
                                <p>You have requested a password reset.</p>
                                <p>Please click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password.</p>
                                
                                `
                            });
                            

        })
        .catch(err => console.log(err))
    })

    
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        let message = req.flash('error')
        if (message.length> 0){
            message = message[0]
        } else {
            message = null;
        }
        res.status(404).render('authentication/new-password', {
            pageTitle: 'Reset Password', 
                path: '/new-password/',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
    
        });
        
    }).catch(err => console.log(err))

};

exports.postNewPassword = (req, res, next) => {
        const newPassword = req.body.password;
        const userId = req.body.userId;
        const passwordToken = req.body.passwordToken;
        let resetUser;

        User.findOne({
          resetToken: passwordToken,
          resetTokenExpiration: { $gt: Date.now() },
          _id: userId
        })
          .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
          })
          .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
          })
          .then(result => {
            res.redirect('/login');
          })
          .catch(err => {
            console.log(err);
          });
};
    