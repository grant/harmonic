var mongoose = require('mongoose');
var User = require('./../models/user');

/*
    Logout the user and redirect to homepage.
*/
exports.logout = function(req, res) {
    if (req.isAuthenticated()) req.logout();
    res.json({
        'response': 'OK'
    });
};

/*

    Get user from access token
 */
exports.getUserFromToken = function(token, callback) {
    User.findOne({accessToken : token}, function (err, user) {
        callback(err, user);
    });
};

/*
Sets if the user is online
 */
exports.setOnline = function (userId, isOnline, callback) {
    User.update({'_id' : userId}, {online: isOnline}, function () {
        if (callback) {
            callback();
        }
    });
};

/**
 * Gets all users that are online
 */
exports.getOnlineUsers = function (callback) {
    User.find({online:true}, function(err, users) {
        callback(err, users);
    });
};

/*
	Get friends that are logged in
 */
exports.getLastTracks = function(req, res) {
    var thisUser = req.user;
    var result = [];

    User.find({online: true}, function(err, users) {
        for (var i = 0; i < users.length; i++) {
            var otherUser = users[i];
            if (thisUser.friends.indexOf(otherUser) != -1) {
                var onlineFriend = {};
                onlineFriend.fbId = otherUser;
                // users are friends
                User.findOne({fbId: otherUser}, function(err, user) {
                    var lastTrack = user.playlist[user.playlist.length-1];
                    var artwork;

                    var url = "https://api.soundcloud.com/resolve.json?consumer_key=2aaf60470a34d42b0561e92b17ec7ce2&url=" + lastTrack;
                    request(url, function(err, resp, body) {
                        body = JSON.parse(body);
                        request(body.location, function(err, r, body) {
                            body = JSON.parse(body);
                            artwork = body.artwork_url;
                            onlineFriend.lastTrack = lastTrack;
                            onlineFriend.artwork = artwork;
                        });
                    });
                });
                result.push(onlineFriend);
            }            
        }
    });

    res.send({data: result});
}
