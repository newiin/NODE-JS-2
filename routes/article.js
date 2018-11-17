const express = require('express');
const Router = express.Router();
const flash = require('connect-flash');
const queryString = require('query-string');
const bodyParser = require('body-parser');
const algoliasearch = require('algoliasearch');
// const client = algoliasearch('NDZD544N8P', '4fc34898026b2541b6c33a7b7d97ef9c');
// const index = client.initIndex('ArticleSchema');
const client = algoliasearch('NDZD544N8P', '4fc348969026b2541b6c33a7b7d97ef9c');
const index = client.initIndex('ArticleSchema');
// Models
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Article = require('../models/Article')
// const pagination = require('../helper/pagination')

Router.get('/all-articles/', (req, res, next) => {
    const options = {
        page: req.query.page,

        limit: 5,
        populate: {
            path: 'category',
            populate: {
                path: 'category'
            }
        },
        select: '',
        sort: {
            date: -1
        },
        lean: true,

    };

    // let out =pagination.pagination(options)
    Article.paginate({}, options).then((result) => {

        let articles = result.docs;
        let current = result.page;
        let totalPages = result.totalPages;
        let hasPrevPage = result.hasPrevPage;
        let hasNextPage = result.hasNextPage;
        let prevPage = result.prevPage;
        let nextPage = result.nextPage;
        let output = "";

        if (current == 1) {
            // output+=`<li class="tg-nextpage disabled" ><a href="#" ><i class="fa fa-angle-right"></i></a></li>`
            output += ` <li class="disabled"><a>First</a></li>`
        } else {
            output += `<li><a href="/all-articles/?page=1">First</a></li>`
        }
        let i = (Number(current) > 5 ? Number(current) - 4 : 1);

        if (i !== 1) {
            output += `<li class="disabled"><a>...</a></li>`
        }
        for (; i < totalPages; i++) {
            if (i == current) {
                output += ` <li class="tg-active"><a>${i}</a></li>`

            } else {
                output += ` <li><a href="/all-articles/?page=${i}">${i}</a></li>`
            }
            if (i == Number(current) + 4 && i < totalPages) {
                output += ` <li class="disabled"><a>...</a></li>`
            }

        }
        if (current == totalPages) {
            output += ` <li class="disabled"><a>Last</a></li>`
        } else {
            output += ` <li><a href="/all-articles/?page=${i}">Last</a></li>`
        }
        res.render('articles/all-articles', {
            articles: articles,
            current: current,
            totalPages: totalPages,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: prevPage,
            nextPage: nextPage,
            output: output

        })



    }).catch((err) => {
        console.log(err);

    })



})

Router.get('/article/:article/details', (req, res) => {
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
            res.render('articles/article-details', {
                article: article,
                title: article.title
            })
        })

})
// Article search
Router.get('/search', (req, res, next) => {
    if (req.query.q) {
        // only query string
        index.search({
                query: req.query.q
            },
            function searchDone(err, content) {
                if (err) throw err;


                res.render('articles/searchResult', {
                    articles: content.hits

                })

            }
        );
    }


})

Router.post('/search', (req, res, next) => {
  

    res.redirect('/search/?q=' + req.body.search)


})
module.exports = Router;