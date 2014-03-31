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
        // Complete book name
        var bookName = req.params.bookOwner+"/"+req.params.bookName;

        // Page name
        var pagePath = req.params[1];
        if (pagePath && utils.getExtension(pagePath) != "md") {
            return res.redirect("https://github.com/"+bookName+"/raw/master/"+pagePath);
        }

        Book.getById(bookName)
        .then(function(book) {
            req.book = book;
            
            if (!pagePath) return;
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
            'book': req.book
        });
    });

    routes.get('/book/:bookOwner/:bookName*', function(req, res, next) {
        res.render('pages/page', {
            'book': req.book,
            'page': req.page,
            'content': req.page.toHtml()
        });
    });
    
    // Register
    register(null, {});
}

// Exports
module.exports = setup;
