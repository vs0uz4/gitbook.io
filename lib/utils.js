var _ = require("lodash");
var Q = require('q');


// Return an error with a specific code
var error = function(code, msg) {
    var e = new Error(msg);
    e.code = code;
    return e;
};

// Return a file extension
var getExtension = function(filename) {
    return filename.split('.').pop();
};


module.exports = {
    error: error,
    getExtension: getExtension
};