var _ = require('lodash');
var Q = require('q');

function setup(options, imports, register) {
    var routes = imports.routes;
    var config = imports.config;
    var analytics = imports.analytics;
    
    // Homepage
    routes.get('/', function(req, res, next) {
        analytics.track("visit", {}, req.user, req);

        res.render('pages/home');
    });
    
    // Register
    register(null, {});
}

// Exports
module.exports = setup;
