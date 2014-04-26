var mongoose = require('mongoose');
var User = require('./../models/user');
var request = require('request');

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

    // find all online users
    User.find({online: true}, function(err, users) {
        // return res.send(users);
        var added = 0;
        for (var i = 0; i < users.length; i++) {
            var friendInDb = false;
            var otherUser = users[i];
            for (var j = 0; j < thisUser.friends.length; ++j) {
                if (thisUser.friends[j].id === otherUser.fbId) {
                    friendInDb = true;
                }
            }

            // console.log(friendInDb);

            if (friendInDb) {
                // console.log(otherUser.name);
                // users are friends
                getOneOnlineFriend(otherUser.fbId, function(onlineFriend) {
                    // console.log(onlineFriend);
                    if (onlineFriend) {
                        // console.log(onlineFriend);
                        result.push(onlineFriend);
                        // console.log(result);
                        ++added;
                        if (added === users.length) {
                            // console.log("first");
                            return res.send(result);
                        }
                    } else {
                        ++added;
                        if (added === users.length) {
                            return res.send(result);
                        }
                    }
                });
            } else {
                ++added;
                if (added === users.length) {
                    return res.send(result);
                }
            }
        }
    });
}


function getOneOnlineFriend(otherUser, callback) {
    User.findOne({fbId: otherUser}, function(err, user) {
        if (user && user.playlist.length) {
            var onlineFriend = {};
            onlineFriend.fbId = otherUser;
            
            var lastTrack = user.playlist[user.playlist.length-1];
            var artwork;

            var url = "https://api.soundcloud.com/resolve.json?consumer_key=2aaf60470a34d42b0561e92b17ec7ce2&url=" + lastTrack;
            request(url, function(err, resp, body) {
                body = JSON.parse(body);
                // console.log(body);
                // request(body.location, function(err, r, body) {
                    // body = JSON.parse(body);
                    artwork = body.artwork_url;
                    onlineFriend.lastTrack = lastTrack;
                    onlineFriend.artwork = artwork || '/images/default.png';
                    // console.log("in " + onlineFriend);
                    callback(onlineFriend);
                // });
            });
        } else {
            callback(null);
        }
    });
}
