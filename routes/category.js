const express = require('express');
const Router = express.Router();
const flash = require('connect-flash');
const bodyParser = require('body-parser');
// Models
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Article = require('../models/Article')

//category
Router.get('/:categorySlug', (req, res) => {
    Category.find({
        slug: req.params.categorySlug
    }).then(category => {
        let cateId
        category.forEach(category => {
            cateId = category._id;
        });

        SubCategory.find({
                category: cateId
            })
            .populate('category')
            .then(subCategories => {

                Article.find({
                        category: subCategories
                    })
                    .populate({
                        path: 'category',
                        populate: {
                            path: 'category'
                        }
                    })
                    .then(articles => {
                        res.render('articles/all-article-by-category', {
                            category: category,
                            articles: articles,
                            subCategories: subCategories,
                            slug:req.params.categorySlug
                        })


                    }).catch(err => {
                        console.log(err);

                    })

            }).catch(err => {
                console.log(err);

            })
    }).catch(err => {
        console.log(err);
    })

});

//sucategory
Router.get('/:categorySlug/:subCategorySlug', (req, res) => {

    SubCategory.find({
            slug: req.params.subCategorySlug
        })
        .then(category => {

            let subcateId ;
            category.forEach(category => {
                 subcateId = category._id;
            });
            Article.find({
                    category: subcateId
                })
                .populate({
                    path: 'category',
                    populate: {
                        path: 'category'
                    }
                })
                .then(articles => {
                    res.render('articles/all-article-by-subcategory', {
                        category: category,
                        articles: articles,

                    })

                }).catch(err => {
                    console.log(err)

                })

        }).catch(err => {
            console.log(err);

        })
})
module.exports = Router