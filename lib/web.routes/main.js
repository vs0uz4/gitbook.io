var _ = require('lodash');
var path = require('path');
var Q = require('q');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("routes");
    var config = imports.config;
    
    var params = {};
    var routes = [];

    // Register a new param accessible using req...
    var registerParam = function(name, method) {
        logger.log("register param", name);
        params[name] = method;
    };

    // Add a route
    var addRoute = function(method, path, handler, options) {
        if (_.isString(handler)) {
            var _template = handler;
            handler = function(req, res) {
                res.render(_template)
            };
        }

        if (!_.isArray(handler)) handler = [handler];

        logger.log("register route", path);
        routes.push({
            'method': method,
            'path': path,
            'handler': handler,
            'options': _.defaults(options || {}, {
                'redirectUser': null,
                'redirectNonUser': null
            })
        });
    };

    // Add a form route
    var addForm = function(path, options) {
        options = _.defaults(options, {
            view: null,

            // Valid before rendering the page (get or post)
            valid: function(req, res) {
                return true;
            },

            // Template data for rednering
            params: function() {
                return {};
            },

            // Render the page (get or post)
            render: function(data, req, res, next) {
                Q(options.valid(req, res)).then(function() {
                    return Q(options.params(req, res));
                }).then(function(args) {
                    res.render(options.view, _.extend(args || {}, data || {}));
                }, next);
            },

            // Get the page
            get: function(req, res, next) {
                options.render({}, req, res, next);
            },

            // Process the post
            process: function() {
                throw "Invalid form";
            },

            // After: error
            error: function(err, req, res, next) {
                if (err.redirect) {
                    res.redirect(err.redirect);
                    return
                }

                options.render({
                    error: err.message || err
                }, req, res, next);
            },

            // After success
            success: function(ret, req, res, next) {
                options.render({
                    success: ret
                }, req, res, next);
            },

            // Options for these routes
            options: {}
        });

        addRoute("get", path, options.get, options.options);
        addRoute("post", path, function(req, res, next) {
            var data = req.body;

            Q(options.valid(req, res)).then(function() {
                return options.process(data, req, res);
            }, next).then(function(message) {
                options.success(message, req, res, next);
            }, function(err) {
                options.error(err, req, res, next);
            });
        }, options.options);
    };

    // Start routes with an express application
    var start = function(app) {
        logger.log("start router");
        // Bind params
        _.each(params, function(method, name) {
            app.param(name, method);
        });

        // Bind routes
        _.each(routes, function(route) {
            logger.log("route", route.method, route.path);
            app[route.method](route.path, function(req, res, next) {
                var auth = req.user != null;

                if (auth && route.options.redirectUser) {
                    return res.redirect(route.options.redirectUser == true? "/boxes" : route.options.redirectUser);
                }
                if (!auth && route.options.redirectNonUser) {
                    return res.redirect(route.options.redirectNonUser == true? "/login" : route.options.redirectNonUser);
                }

                next();
            }, route.handler);
        });
    };

    // Auth an user then result
    var authUser = function(user, req, res) {
        req.session.userToken = user.token;
        res.redirect("/boxes");
    };

    // Register
    register(null, {
        'routes': {
            'start': start,
            'add': addRoute,

            'get': _.partial(addRoute, "get"),
            'post': _.partial(addRoute, "post"),
            'delete': _.partial(addRoute, "delete"),
            'put': _.partial(addRoute, "put"),
            'all': _.partial(addRoute, "all"),
            
            'form': addForm,
            'auth': authUser,
            'param': registerParam
        }
    });
}

// Exports
module.exports = setup;
