var _ = require('lodash');
var Q = require('q');

var FEATURED = [
    {
        id: "GitbookIO/jsbook",
        title: "Learn Javascript",
        description: "Learn how to make your websites interactive and how to build browser based games."
    },
    {
        id: "SamyPesse/How-to-Make-a-Computer-Operating-System",
        title: "How to make an operating system in C++",
        description: "Learn how to make a computer operating system from scratch in C/C++."
    }
]

function setup(options, imports, register) {
    var routes = imports.routes;
    var config = imports.config;
    var analytics = imports.analytics;

    // Homepage
    routes.get('/', function(req, res, next) {
        analytics.track("visit", {}, req.user, req);

        res.render('pages/home', {
            featured: FEATURED
        });
    });
    
    // Register
    register(null, {});
}

// Exports
module.exports = setup;
