var _ = require('lodash');
var Q = require('q');

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

    // Return a page by its path
    Book.prototype.getPage = function(path, revision) {
        return Page.getByPath(this, path, revision);
    };

    // Getters
    Book.getById = function(name) {
        var repo = github.client.repo(name);
        return Q.nfcall(repo.info.bind(repo)).get(0)
        .then(function(info) {
            return new Book(info);
        });
    };

    
    // Register
    register(null, {
        Book: Book
    });
}

// Exports
module.exports = setup;
