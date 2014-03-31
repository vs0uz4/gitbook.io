var _ = require('lodash');
var Q = require('q');
var events = require('events');
var util = require('util');

var passport = require('passport');
var github = require('octonode');

var GitHubStrategy = require('passport-github').Strategy;

function setup(options, imports, register) {
    var logger = imports.logger.namespace("book");
    var config = imports.config;
    var analytics = imports.analytics;
    
    // Base client
    var client = github.client();

    // Init oauth
    var initOauth = function(app) {
        passport.use(
            new GitHubStrategy({
            clientID: config.github.id,
            clientSecret: config.github.secret,
            callbackUrl: "/auth/callback"
        }, function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }));

        app.get('/auth', passport.authenticate('github'));

        app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
            res.redirect('/');
        });
    };

    
    // Register
    register(null, {
        github: {
            init: initOauth,
            client: client
        }
    });
}

// Exports
module.exports = setup;
