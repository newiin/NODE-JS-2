const express = require('express');
const Router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const flash = require('connect-flash');
const fs = require('fs-extra');
const path = require('path');
const moment=require('moment')
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

/**
 * Home page
 */

Router.get('/my', (req, res) => {
    // res.render('admin/dashboard', {
    //     successMessage: successMessage
    // })


    Article.find({})
        .populate({
            path: 'category',
            populate: {
                path: 'category'
            }
        })

        .then(articles => {
            res.render('admin/dashboard', {
                articles: articles,moment:moment
            })
        })
})


/**
 * Category route
 */

Router.get('/category/add-category', (req, res) => {
    res.render('admin/create-category')
});

Router.post('/category/add-category', (req, res) => {
    req.check('category', 'fill the category').notEmpty().trim().escape();
    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/create-category', {
            errors: errors
        });
    } else {
        const newCategory = new Category({
            name: req.body.category,
            slug: slugify(req.body.category, {
                replacement: '-',
                lower: true
            })
        })
        newCategory.save().then(saveCategory => {
            successMessage = "category added"
            res.redirect('/admin/auth/my')

        }).catch((err) => {
            console.log(err);

        })
    }

});
Router.get('/category/all-category', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/all-category', {
            categories: categories
        });

    }).catch(err => {
        console.log(err);

    })
})

//Edit category
Router.get('/category/:id/edit', (req, res) => {
    Category.findById({
            _id: req.params.id
        })
        .then(category =>
            res.render("admin/edit-category", {
                category: category
            })
        )
})
Router.put('/category/:id/edit', (req, res) => {
    req.check('category', 'fill the category').notEmpty().trim().escape();
    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/edit-category', {
            errors: errors
        });
    } else {

        Category.findByIdAndUpdate({
            _id: req.params.id
        }).then(category => {
            category.name = req.body.category;
            category.slug = slugify(req.body.category, {
                replacement: '-',
                lower: true
            });
            category.save().then(updatedCategory => {
                successMessage = "category modified"
                res.redirect('/admin/auth/my')
            }).catch((err) => {
                console.log(err);

            })
        })

    }
})
Router.get('/category/:id/delete', (req, res) => {

    Category.findByIdAndRemove({
        _id: req.params.id
    }).then(category => {

        fs.unlink(path.join(__dirname, '/../../public/images/' + post.file), function (err) {
            if (err) {
                console.error(err);
            }
            console.log('File has been Deleted');
            res.redirect('/user');
        });
        successMessage = "category " + category.name + " deleted"
        res.redirect('/admin/auth/my')
    })

})
/**
* SubCategory Route

 */
Router.get('/subcategory/add-subcategory', (req, res) => {
    Category.find({})
        .then(categories => {
            res.render('admin/create-subcategory', {
                categories: categories
            });

        }).catch(err => {
            console.log(err);

        })


});

Router.post('/subcategory/add-subcategory', (req, res) => {
    req.check('subcategory', 'fill the sucategory').notEmpty().trim().escape();
    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/create-subcategory', {
            errors: errors
        });
    } else {
        const newSubCategory = new SubCategory({
            name: req.body.subcategory,
            category: req.body.category,
            slug: slugify(req.body.subcategory, {
                replacement: '-',
                remove: null,
                lower: true
            })
        })
        newSubCategory.save().then(saveSubCategory => {
            successMessage = "subcategory added"
            res.redirect('/admin/auth/my')

        }).catch((err) => {
            console.log(err);

        })
    }

});
//get all sub categories
Router.get('/subcategory/all-subcategory', (req, res) => {
    SubCategory.find({})
        .populate('category')
        .then(subcategories => {
            res.render('admin/all-subcategory', {
                subcategories: subcategories
            });

        }).catch(err => {
            console.log(err);

        })


})

//Edit subcategory
Router.get('/subcategory/:id/edit', (req, res) => {
    SubCategory.findById({
            _id: req.params.id
        }).populate('category')
        .then(subcategory =>
            res.render("admin/edit-subcategory", {
                subcategory: subcategory
            })
        )
})
Router.put('/subcategory/:id/edit', (req, res) => {
    req.check('subcategory', 'fill the category').notEmpty().trim().escape();
    let errors = req.validationErrors();
    if (errors) {
        SubCategory.findById({
                _id: req.params.id
            }).populate('category')
            .then(subcategory => {
                res.render('admin/edit-subcategory', {
                    subcategory: subcategory,
                    errors: errors
                });

            }).catch(err => {
                console.log(err);

            })

    } else {

        SubCategory.findByIdAndUpdate({
            _id: req.params.id
        }).then(subcategory => {
            subcategory.name = req.body.subcategory;
            subcategory.slug = slugify(req.body.subcategory, {
                replacement: '-',
                lower: true
            });
            subcategory.save().then(updatedSubCategory => {
                successMessage = "subcategory modified"
                res.redirect('/admin/auth/my')
            }).catch((err) => {
                console.log(err);

            })
        })

    }
})
Router.get('/subcategory/:id/delete', (req, res) => {
    SubCategory.findByIdAndRemove({
        _id: req.params.id
    }).then(subcategory => {

        
        successMessage = "subcategory delete"
        res.redirect('/admin/auth/my')
    })


})
/**
 * 
 * Article
 */

//create an article
Router.get('/article/create', (req, res) => {

    res.render('admin/create');
})

Router.post('/article/create', (req, res) => {
    req.check('title', 'Title can be empty').notEmpty().trim().escape();
    req.check('overview', 'overview can be empty').notEmpty().trim().escape();
    req.check('link', 'link can be empty').notEmpty().trim().unescape();
    req.check('category', 'Select a Category').notEmpty().trim().escape();
    req.check('body', 'Body can be empty').notEmpty().trim().unescape();

    let errors = req.validationErrors();
    if (errors) {
        SubCategory.find({})
            .then(subcategories => {
                res.render('admin/create', {
                    subcategories: subcategories,
                    errors: errors
                });

            }).catch(err => {
                console.log(err);

            })
    } else {
        let file = req.files.file.name;
        if (req.files.file) {
            let filename = req.files.file
            filename.mv('./public/images/' + filename.name, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    const newArticle = new Article({
                        title: req.body.title,
                        overview: req.body.overview,
                        link: req.body.link,
                        category: req.body.category,
                        body: req.body.body,
                        image: file
                    })
                    newArticle.save().then(articleSaved => {
                        successMessage = "Article added"
                        res.redirect('/admin/auth/my')
                    }).catch((err) => {
                        console.log(err);

                    })
                }


            });
        } else {
            res.send('something was wrong ')
        }


    }

})

// Edit article
Router.get('/article/:article/edit', (req, res) => {

    Article.findById({
            _id: req.params.article
        })
        .populate({
            path: 'category',
            populate: {
                path: 'category'
            }
        })
        .then(article =>
            res.render("admin/edit-article", {
                article: article
            })
        )
})


Router.put('/article/:article/edit', (req, res) => {
    req.check('title', 'Title can be empty').notEmpty().trim().escape();
    req.check('overview', 'overview can be empty').notEmpty().trim().escape();
    req.check('link', 'link can be empty').notEmpty().trim().unescape();
    req.check('body', 'Body can be empty').notEmpty().trim().unescape();
    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit-article', {
            errors: errors
        });

    } else {
       ;
        Article.findByIdAndUpdate({
            _id: req.params.article
        }).then(article => {

            article.title = req.body.title,
            article.overview = req.body.overview,
            article.link = req.body.link,
            article.body = req.body.body
            article.save().then(articleUpdated => {
                res.redirect("/admin/auth/my")
            })
        })

    }
})
// Delete article
Router.get('/article/:article/delete', (req, res) => {

    Article.findOneAndDelete({
        _id: req.params.article
    }).then(article => {
        
         
        fs.unlink(path.join(__dirname, '../public/images/' + article.image), function (err) {
            if (err) {
                console.error(err);
            }
            console.log('File has been Deleted');
            res.redirect("/admin/auth/my")
        });
        
    }).catch(err => {
        console.log("we can not delete this item" + err);
    });
})

// preview article
Router.get('/article/:article/preview', (req, res) => {

    Article.findById({
        _id: req.params.article
    })
    .populate({
        path: 'category',
        populate: {
            path: 'category'
        }
    })

    .then(article => {
        res.render('admin/article-preview', {
            article: article,
            title: article.title
        })
    })

})
//approve ther article
Router.get('/article/:article/approve', (req, res) => {

    Article.findById({
        _id: req.params.article
    })
    .populate({
        path: 'category',
        populate: {
            path: 'category'
        }
    })

    .then(article => {
        
        article.isAccepted = true
        article.save().then(articleAprouved => {
            res.redirect('/admin/auth/my')
        }).catch((err) => {
            console.log(err);

        })
        
    })

})
// all articles
Router.get('/article/all-articles', (req, res) => {

    Article.find({})
    .populate({
        path: 'category',
        populate: {
            path: 'category'
        }
    })
    .then(articles => {
        res.render('admin/all-articles',{articles:articles})
  
    }).catch((err) => {
        console.log(err);
        
    })

}) 

module.exports = Router;