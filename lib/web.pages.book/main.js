var _ = require('lodash');
var Q = require('q');
var utils = require("../utils");

function setup(options, imports, register) {
    var routes = imports.routes;
    var config = imports.config;
    var analytics = imports.analytics;
    var Book = imports.Book;

    // Book req.book helper
    routes.param("bookOwner", function(req, res, next) {
        console.log(req.params);

        var bookName = req.params.bookOwner+"/"+req.params.bookName;
        Book.getById(bookName)
        .then(function(book) {
            req.book = book;
            
            if (!req.params[1]) return;

            var pagePath = req.params[1];

            return req.book.getPage(pagePath)
            .then(function(page) {
                req.page = page;
            }, function() {
                throw "Error getting page "+pagePath;
            });
        }, function() {
            throw "Error getting book "+bookName;
        })
        .then(function() {
            next();
        }, function(err) {
            next(utils.error(404, err.message || err));
        })
    });

    
    routes.get('/book/:bookOwner/:bookName', function(req, res, next) {
        res.render('pages/book', {
            'book': req.book.toJSON()
        });
    });

    routes.get('/book/:bookOwner/:bookName*', function(req, res, next) {
        res.render('pages/page', {
            'book': req.book.toJSON(),
            'page': req.page.toJSON(),
            'content': req.page.toHtml()
        });
    });
    
    // Register
    register(null, {});
}

// Exports
module.exports = setup;
