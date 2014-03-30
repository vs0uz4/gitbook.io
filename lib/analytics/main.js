var _ = require('lodash');
var Mixpanel = require('mixpanel');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("analytics");
    var config = imports.config;
    var mixpanel = null;

    var isAvailable = function() {
        return config.mixpanel.token != null;
    };

    var getClientAddress = function (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
            || req.connection.remoteAddress;
    };
    
    // Track an event
    var track = function(name, properties, user, req) {
        properties = properties || {};

        // Requete
        if (req) {
            _.extend(properties, {
                'ip': getClientAddress(req),
                '$browser': req.useragent.Browser,
                '$os': req.useragent.OS,
                'bot': req.useragent.isBot,
                'variant': req.session.variant
            });
            if (!user) user = req.user;
        }

        // User
        if (user != null) {
            properties.distinct_id = user.id.toString();
        }
        properties.visitor = user == null;

        logger.log("track", name, properties);
        if (!isAvailable()) return false;
        mixpanel.track(name, properties);
    };

    // Identify an user
    var identify = function(user) {
        if (!isAvailable()) return false;

        var properties = {
            'id': user.id.toString(),
            '$email': user.email,
            '$name': user.name,
            'repos': _.size(user.repos),
            'plan': user.plan,
            'cla': user.claAgreement,
            'boxes': user.nBoxes,
            'trialUsed': user.trialUsed,
            'stripe': user.stripeCustomer
        };

        logger.log("identify user", properties);
        mixpanel.people.set(user.id.toString(), properties);
    };

    // Remove a user
    var removeUser = function(user) {
        if (!isAvailable()) return false;
        mixpanel.people.delete_user(user.id.toString());

        return true;
    };

    if (isAvailable()) {
        logger.log("Analytics using mixpanel");
        mixpanel = Mixpanel.init(config.mixpanel.token);
    }

    register(null, {
        'analytics': {
            'isAvailable': isAvailable,
            'track': track,
            'identify': identify,
            'removeUser': removeUser
        }
    });
};

// Exports
module.exports = setup;
