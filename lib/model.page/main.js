var _ = require('lodash');
var Q = require('q');
var markdown = require( "markdown" ).markdown;

function setup(options, imports, register) {
    var logger = imports.logger.namespace("book");
    var config = imports.config;
    var analytics = imports.analytics;
    var github = imports.github;
    var Model = imports.Model;
    
    var Page = Model.inherits("Page");

    Page.defaults = {
        'path': "",
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

    // Convert page content to html
    Page.prototype.toHtml = function() {
        var text = this.toText();
        return markdown.toHTML(text);
    };

    // Get a page from a book by its path
    Page.getByPath = function(book, path, revision) {
        var repo = book.repo();

        return Q.nfcall(repo.contents.bind(repo), path).get(0)
        .then(function(file) {
            console.log(file);

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
