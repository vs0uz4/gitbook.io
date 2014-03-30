var _ = require('lodash');
var Q = require('q');
var events = require('events');
var util = require('util');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("book");
    var config = imports.config;
    var analytics = imports.analytics;
    
    var Model = function(attrs, options) {
        events.EventEmitter.call(this);

        this.attributes = _.defaults(attrs || {}, this.constructor.defaults);
        this.options = _.defaults(options || {}, this.constructor.defaultOptions);

        this.initialize();
    };
    util.inherits(Model, events.EventEmitter);

    Model.defaults = {};
    Model.defaultOptions = {};

    // Intialization of the model
    Model.prototype.initialize = function() {
        
    };

    // Return a json representation
    Model.prototype.toJSON = function() {
        return this.attributes;
    };

    // Inherit
    Model.inherits = function(className) {
        var Class = function(attributes) {
            Model.apply(this, arguments);
        }
        util.inherits(Class, Model);

        Class.name = className;

        return Class;
    };

    
    // Register
    register(null, {
        Model: Model
    });
}

// Exports
module.exports = setup;
