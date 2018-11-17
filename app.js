const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const edge = require('edge.js');
const passport = require('passport');
const csrf = require('csurf');
const overrride = require('method-override');
const csrfProtection = csrf({
    cookie: true
});
const upload = require('express-fileupload');
const fs = require('fs-extra');
const moment = require('moment');
const app = express();


//Custom modules
const config = require('./config/config');
const mainRoute = require('./routes/main');
const adminRoute = require('./routes/admin');
const articleRoute = require('./routes/article');
const categoryRoute = require('./routes/category');
const writerRoute=require('./routes/writer');
const LocalStrategy=require('./config/passport-local');

// const {isLoggedIn} =require('./helper/authentification');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');

/**
 * DATABASE
 */
//Require DB
const DB = require('./database/db');
/**
 * MIDDLEWARE
 */

app.use(require('express-edge'));
app.set('case sensitive routing', true);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', `${__dirname}/views`);



app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser())
app.use(flash());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw({
    type: 'text/html'
}))
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(upload());
// methode ovverride
app.use(overrride('_method'));
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.title = req.title || null;
    res.locals.successMessage = req.flash('successMessage') || null;
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.error = req.flash('error');
    next();
})
// app.get('*', function (req, res, next) {
//     res.locals.cart = req.session.cart;
//     next();
// })
// Subcategories
SubCategory.find({})
    .populate('category')
    .then(subcategories => {
        app.locals.subcategories = subcategories

    }).catch(err => {
        console.log(err)
    })
// categories
Category.find({})
    .then(categories => {
        app.locals.categories = categories
    }).catch(err => {
        console.log(err);

    })
app.use(mainRoute);
app.use(articleRoute);
app.use(categoryRoute);
app.use('/admin/auth', adminRoute);
app.use('/writer',writerRoute);
// app.use('/user',isLoggedIn,adsRoute);



//App params

/**
 * SERVER
 */
app.listen(config.port, err => {
    if (err) {
        console.log('we can not conneted to the server');
    } else {
        console.log(`connected to the server at port ${config.port}`)
    }
})