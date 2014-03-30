var engineer = require('engineer');
var path = require("path");

var modules = [
    "./config",
    "./logger",
    "./analytics",
    "./github",

    "./model",
    "./model.book",
    "./model.page",

    "./web.routes",
    "./web.pages.main",
    "./web.pages.book"
];

var app = new engineer.Application({
    'paths': [
        path.resolve(__dirname, 'lib')
    ]
});
app.on("error", function(err) {
    console.log("Error in the application:");
    console.log(err.stack);
    process.exit(1);
});
app.load(modules)
.then(function() {
    return app.load([
        "./web.main"
    ])
})
.then(function() {
    console.log('Hit CTRL-C to stop the application');
});