var _ = require('lodash');
var Q = require('q');
var events = require('events');
var util = require('util');

var github = require('octonode');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("book");
    var config = imports.config;
    var analytics = imports.analytics;
    
    var client = github.client();

    
    // Register
    register(null, {
        github: {
            client: client
        }
    });
}

// Exports
module.exports = setup;
