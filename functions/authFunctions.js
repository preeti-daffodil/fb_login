var q = require('q');
var config = require('../config');
var OAuth2 = require('oauth').OAuth2;
var appID = config.appID;
var appSecreatKey = config.appSecreatKey;
var redirectUrl = config.redirectUrl;
var mongo = require('mongodb');
var url = 'mongodb://127.0.0.1:27017/fb_login';


var mangeUserCountInDB = function (userid) {
    var d = q.defer();
    var db = mongo.connect(url, function (err, db) {
        db.collection('Users').find({'user_id': userid}).toArray(function (err, result) {
            // console.log('result >> >> ' + JSON.stringify(result))
            if (result && result.length > 0) {
                var login_count = 0;
                if (result[0].login_count) {
                    login_count = Number(result[0].login_count);
                    login_count++
                }
                // console.log('final login count ' + login_count)
                db.collection("Users").update({"user_id": userid}, {$set: {"login_count": login_count}})
                d.resolve(login_count)
            } else {
                db.collection('Users').insert({"user_id": userid, "login_count": 1});
                d.resolve(1)
            }
        })
    });
    return d.promise
};

var getOAuth = function () {
    return new OAuth2(appID, appSecreatKey,
        '', 'https://www.facebook.com/dialog/oauth', 'https://graph.facebook.com/oauth/access_token')
}

var getaccesstoken = function (code) {
    var d = q.defer();
    var params = {"grant_type": "authorization_code", "redirect_uri": redirectUrl};
    getOAuth().getOAuthAccessToken(code, params,
        function (err, accessToken, refreshToken, params) {
            d.resolve(params.access_token);
        });
    return d.promise
};

var getprofiledata = function (token) {
    var d = q.defer();

    getOAuth().get('https://graph.facebook.com/v2.5/me?fields=id,name,picture,email', token, function (err, body, res) {
        var json;
        if (err) {
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            // return done(new Error('Failed to parse user profile'));
        }
        d.resolve(json)
    });
    return d.promise

};

module.exports = {
    getaccesstoken: getaccesstoken,
    getprofiledata: getprofiledata,
    mangeUserCountInDB: mangeUserCountInDB
};