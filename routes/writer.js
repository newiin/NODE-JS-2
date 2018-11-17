const express = require('express');
const Router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const flash = require('connect-flash');
const fs = require('fs-extra');
const path = require('path');
const {
    check,
    validationResult
} = require('express-validator/check');
const {
    matchedData,
    sanitize
} = require('express-validator/filter');
// Models
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Article = require('../models/Article')
const Writer = require('../models/Writer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// register


Router.get('/auth/register', (req, res) => {
    res.render('writer/register')
})
Router.post('/auth/register', (req, res) => {
    req.check('email', 'Invalid email/Email required').isEmail().trim().normalizeEmail();
    req.check('password', 'password must be 8 characteres').isLength({
        min: 8
    });
    // req.check('password','password must contain a number').matches(/\d/);
    req.check('name', 'name can be blank').notEmpty().trim().escape();
    req.check('password', "Passwords don't match").custom((value) => {
        if (value !== req.body.confirm) {
            return false;
        } else {
            return value;
        }
    });

    let errors = req.validationErrors();
    if (errors) {
        res.render('writer/register', {
            errors: errors
        })
    } else {
        Writer.findOne({
            'local.email': req.body.email
        }).then(user => {
            if (user) {
                errorMessage = "this email is used";
                res.render('writer/register', {
                    errorMessage: errorMessage
                });
            } else {

                const newWriter = new Writer({
                    'local.email': req.body.email,
                    'local.password': req.body.password,
                    'local.name': req.body.password,
                    'image': 'test'

                });

                Writer.createWriter(newWriter, (err, writer) => {

                    if (err) {
                        console.log(err);

                    } else {
                        res.redirect('/')
                    }

                });
            }
        }).catch((err) => {
            console.log(err);

        })

    }

})


// login
Router.get('/auth/login', (req, res) => {
    res.render('writer/login')
})

Router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/writer/auth/login',
        failureFlash: true
    })(req, res, next);

});


// logout
// /Route logout
Router.get('/auth/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// writer dashbord
Router.get('/auth/dashboard', (req, res) => {
    res.render('writer/dashboard')
})
// writer create article
Router.get('/auth/article/create', (req, res) => {
    res.render('writer/login')
})

Router.post('/auth/article/create', (req, res) => {
    res.render('writer/login')
})
// writer edit article 
Router.get('/auth/article/:id/edit', (req, res) => {
    res.render('writer/login')
})

Router.post('/auth/article/:id/edit', (req, res) => {
    res.render('writer/login')
})
// writer preview article
Router.get('/auth/article/:id/preview', (req, res) => {
    res.render('writer/login')
})
// writer delete article
Router.get('/auth/article/:id/delete', (req, res) => {
    res.render('writer/login')
})

Router.get('/auth/all-articles', (req, res) => {
    res.render('writer/login')
})


module.exports = Router