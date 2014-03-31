var _ = require('lodash');
var Q = require('q');

var gitbook = require('gitbook');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("book");
    var config = imports.config;
    var analytics = imports.analytics;
    var github = imports.github;
    var Model = imports.Model;
    var Page = imports.Page;
    
    var Book = Model.inherits("Book");

    Book.defaults = {
        'name': "",
        'url': ""
    };

    // Return the associated github repository
    Book.prototype.repo = function() {
        return github.client.repo(this.attributes.full_name);
    };

    // Read a file by its path
    Book.prototype.readFile = function(path, revision) {
        var repo = this.repo();
        return Q.nfcall(repo.contents.bind(repo), path).get(0);
    };

    // Return a page by its path
    Book.prototype.getPage = function(path, revision) {
        return Page.getByPath(this, path, revision);
    };

    // Read summary
    Book.prototype.readSummary = function() {
        var that = this;

        return this.getPage("SUMMARY.md")
        .then(function(page) {
            return gitbook.summary(page.toText());
        })
        .then(function(summary) {
            console.log(summary);
            that.attributes.summary = summary;
            return summary;
        })
    };



    // Getters
    Book.getById = function(name) {
        var book;
        var repo = github.client.repo(name);

        return Q.nfcall(repo.info.bind(repo)).get(0)
        .then(function(info) {
            book = new Book(info);
            return book.readSummary();
        })
        .then(function() {
            return book;
        })
    };

    
    // Register
    register(null, {
        Book: Book
    });
}

// Exports
module.exports = setup;
