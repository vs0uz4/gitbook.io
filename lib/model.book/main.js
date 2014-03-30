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

    // Read a file by its path
    Book.prototype.readFile = function(path, revision) {
        var repo = this.repo();
        return Q.nfcall(repo.contents.bind(repo), path).get(0);
    };

    // Return a page by its path
    Book.prototype.getPage = function(path, revision) {
        return Page.getByPath(this, path, revision);
    };

    // Read .gitbook file informations
    Book.prototype.getBookInfos = function() {
        var that = this;

        /*return this.readFile(".gitbook")
        .then(function(file) {
            return (new Buffer(file.content, "base64")).toString();
        })*/

        var exampleGitbook = {
            summary: [
                {
                    title: "Chapter 1",
                    path: "Chapter-1/README.md"
                },
                {
                    title: "Chapter 2",
                    path: "Chapter-2/README.md"
                },
                {
                    title: "Chapter 3",
                    path: "Chapter-3/README.md"
                }
            ]
        };

        return Q(exampleGitbook)
        .then(function(content) {
            that.attributes.gitbook = content;
            return content;
        });
    };



    // Getters
    Book.getById = function(name) {
        var book;
        var repo = github.client.repo(name);

        return Q.nfcall(repo.info.bind(repo)).get(0)
        .then(function(info) {
            book = new Book(info);
            return book.getBookInfos();
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
