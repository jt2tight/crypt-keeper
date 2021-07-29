const express = require('express');
const ejs = require('ejs');
const axios = require('axios');

const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const homeRoutes = require('./routes/home');
const errorController = require('./controllers/error');
const helmet = require('helmet');
const compression = require('compression');


const mongoose = require('mongoose');
MONGODB_URI = process.env.CONNECTION_STRING;
const User = require('./models/user');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const { header } = require('express-validator');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

app.use(helmet({
    contentSecurityPolicy: false,
}
));

app.use(compression());

app.use(bodyParser.urlencoded( { extended: false } ));
app.use(express.static(path.join(__dirname,'public')));


app.use(session
    ({
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false, 
        store: store 
    })
);


app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
    if(!req.session.user){
        res.locals.isAuthenticated = false;
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user){
            return next(); 
        }
        req.user = user; 
        req.session.isLoggedin = true;
        res.locals.isAuthenticated = true; 
        next();
    })
    .catch(err => {
        throw new Error(err);
    });

});



app.use((req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.set('view engine', 'ejs');
app.set('views','views');




app.use(homeRoutes);
app.use(authRoutes);
app.use(portfolioRoutes);

app.get(errorController.get500);

app.use(errorController.get404);



//MONGOOSE CONNECTION

mongoose.connect(MONGODB_URI)
.then(result =>{
    app.listen(process.env.PORT || 3050);
})
.catch(err =>{
    console.log(err);
})


