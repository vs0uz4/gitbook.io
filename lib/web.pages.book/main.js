var _ = require('lodash');
var Q = require('q');
var utils = require("../utils");

function setup(options, imports, register) {
    var routes = imports.routes;
    var config = imports.config;
    var analytics = imports.analytics;
    var Book = imports.Book;

    // param book
    routes.param("bookOwner", function(req, res, next) {
        var bookName = req.params.bookOwner+"/"+req.params.bookName;

        Book.getById(bookName)
        .then(function(book) {
            req.book = book;
            next();
        }, function(err) {
            next(utils.error(404, "Error getting book "+bookName));
        });
    })
    
    // Homepage
    routes.get('/book/:bookOwner/:bookName', function(req, res, next) {
        res.render('pages/book', {
            'book': req.book.toJSON()
        });
    });
    
    // Register
    register(null, {});
}

// Exports
module.exports = setup;
