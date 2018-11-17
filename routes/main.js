const express = require('express');
const Router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment=require('moment')
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Article = require('../models/Article')

/**
 * Home page
 */


Router.get('/', (req, res) => {
    Article.find({})
    .populate({
        path: 'category',
        populate: {
            path: 'category'
        }
    }).limit(12)
    .then(articles => {
        res.render('index', {
            articles: articles
           
        })
    })
   
})

/**
 * Details page
 */

module.exports = Router; 

