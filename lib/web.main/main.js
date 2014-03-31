var _ = require("lodash");
var express = require("express");
var useragent = require('express-useragent');
var http = require('http');
var passport = require('passport');
var swig = require('swig');
var fs = require('fs');
var Q = require('q');
var path = require('path');
var st = require('st');

var utils = require("../utils");

function setup(options, imports, register) {
    var config = imports.config;
    var logger = imports.logger.namespace("web");
    var analytics = imports.analytics;
    var routes = imports.routes;
    var github = imports.github;

    // Create server
    var app = express();
    var server = http.createServer(app);

    // Configure passport
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Templates
    app.engine('html', swig.renderFile);
    app.engine('xml', swig.renderFile);
    app.engine('txt', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.resolve(__dirname, '../../templates'));
    swig.setDefaults({
        locals: {
            'config': config
        },
        cache: config.debug? false : "memory"
    });
    app.set('view cache', !config.debug);

    if (config.debug) {
        app.use(express.logger());
    } else {
        // Force https in production
        app.use(function(req, res, next){
            if(req.headers['x-forwarded-proto'] != 'https') {
                return res.redirect(301, 'https://'+req.host+req.url);
            }
            return next();
        });
    }

    // Enable GZIP compression
    app.use(express.compress());

    // Body parser
    app.use(express.bodyParser());

    // User agent parsing
    app.use(useragent.express());

    // Enable session
    app.use(express.cookieParser());
    app.use(express.session({ secret: config.web.sessionSecret }));
    

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Templates locals
    app.use(function(req, res, next) {
        res.locals.useragent = req.useragent;
        res.locals.user = req.user;
        res.locals.form = req.body;
        res.locals.query = req.query;

        next();
    });

    // Static files
    app.get('/favicon.ico', function(req, res, next) {
        res.redirect("/static/favicon.ico");
    });
    app.use(st({
        path: path.resolve(__dirname + '/../../public/static'), // resolved against the process cwd
        url: 'static/', // defaults to '/'

        cache: config.debug ? false : { // specify cache:false to turn off caching entirely
            fd: {
                max: 1000, // number of fd's to hang on to
                maxAge: 1000*60*60, // amount of ms before fd's expire
            },

            stat: {
                max: 5000, // number of stat objects to hang on to
                maxAge: 1000 * 60, // number of ms that stats are good for
            },

            content: {
                max: 1024*1024*64, // how much memory to use on caching contents
                maxAge: 1000 * 60 * 10, // how long to cache contents for
            },

            index: { // irrelevant if not using index:true
                max: 1024 * 8, // how many bytes of autoindex html to cache
                maxAge: 1000 * 60 * 10, // how long to store it for
            },

            readdir: { // irrelevant if not using index:true
                max: 1000, // how many dir entries to cache
                maxAge: 1000 * 60 * 10, // how long to cache them for
            }
        },

        index: false, // indexing options

        dot: false, // Return 403 for any url with a dot-file part

        passthrough: true,
    }));

    // Router
    app.use(app.router);

    // oAuth
    github.init(app);

    // Initialize routes
    routes.start(app);

    // No route
    app.use(function(req, res, next) {
        next(utils.error(404, "Page don't exists"));
    });

    // Error handling
    app.use(function(err, req, res, next) {
        if(!err) return next();

        var msg = err.message || err;
        var code = err.code || 500;

        // Return error
        res.format({
            'text/plain': function(){
                res.status(code);
                res.send(msg);
            },
            'text/html': function () {
                res.render('error', {
                    'code': code,
                    'error': msg
                });
            },
            'application/json': function (){
                res.status(code);
                res.send({
                    'error': msg,
                    'code': code
                });
            }
        });

        logger.error(err.stack || err);
    });

    // Start server
    logger.log("Start listening server on port", config.web.port);
    server.listen(config.web.port, function(err) {
        if (err) logger.exception(err);

        logger.log("Server is listening!");
        register(null, {});
    });    
}

// Exports
module.exports = setup;
