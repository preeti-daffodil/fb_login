var config = require('./config');
var q = require('q');
var appID = config.appID;
var appSecreatKey = config.appSecreatKey;
var redirectUrl = config.redirectUrl;
var authFunctions = require('./functions/authFunctions');


var httpConfig = function (app) {
    var d = q.defer();
    app.use(function (req, res, next) {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Access-Control-Allow-Origin', '*');
        next()
    });

    app.all('/login', function (req, res) {
        res.send("<h1>Login Screen!! </h1><a href='https://www.facebook.com/dialog/oauth?response_type=code&redirect_uri=" + redirectUrl + "&client_id=" + appID + "'>LOGIN</a>")
    });

    app.all('/auth', function (req, res) {
            // console.log('query >> >> ' + JSON.stringify(req.query))
            return authFunctions.getaccesstoken(req.query.code).then(function (token) {
                // console.log('token >> >> ' + token)
                return authFunctions.getprofiledata(token).then(function (final_data) {
                    // console.log('finally final data >> >> ' + JSON.stringify(final_data))
                    return authFunctions.mangeUserCountInDB(final_data.id).then(function (login_count) {
                        var imgurl = final_data.picture.data.url;
                        var name = final_data.name;
                        res.send("<div>Name : " + name + "</div><image src='" + imgurl + "'></image><div>Login Count : " + login_count + "</div><a href='http://" + req.host + ":" + config.PORT + "/login'>LOGOUT</a>")
                    })
                });
            })
        }
    );
    d.resolve();
    return d.promise
};

module.exports = {
    httpConfig: httpConfig
};