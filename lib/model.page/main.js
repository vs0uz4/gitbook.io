var _ = require('lodash');
var Q = require('q');

var gitbook = require('gitbook');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("book");
    var config = imports.config;
    var analytics = imports.analytics;
    var github = imports.github;
    var Model = imports.Model;
    
    var Page = Model.inherits("Page");

    Page.defaults = {
        'name': "",
        'path': "",

        // Base64 content
        'content': ""
    };

    Page.defaultOptions = {
        book: null
    };

    // Convert page content to text
    Page.prototype.toText = function() {
        var buf = new Buffer(this.attributes.content, 'base64');
        return buf.toString();
    };

    // Parse page content to extract text and exercises
    Page.prototype.parse = function() {
        var text = this.toText();
        return gitbook.page(text);
    };

    // Get a page from a book by its path
    Page.getByPath = function(book, path, revision) {
        return book.readFile(path, revision)
        .then(function(file) {
            return new Page(file, {
                book: book
            });
        });
    };
    
    // Register
    register(null, {
        Page: Page
    });
}

// Exports
module.exports = setup;
