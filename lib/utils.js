var _ = require("lodash");
var Q = require('q');


// Return an error with a specific code
var error = function(code, msg) {
    var e = new Error(msg);
    e.code = code;
    return e;
};


module.exports = {
    error: error
};