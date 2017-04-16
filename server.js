var express = require('express');
var config = require('./config');
var PORT = config.PORT;
var http = require('./http');
var app = express();

http.httpConfig(app).then(function () {
    app.listen(PORT, function () {
        console.log('FB login server is running on ' + PORT + ' PORT');
    });
});