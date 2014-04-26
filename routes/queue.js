var mongoose = require('mongoose');
var User = require('./../models/user');
var request = require('request');

// calls soundcloud api and gets 50 songs
function getTracks(callback) {
    var url = "https://api.soundcloud.com/tracks.json?consumer_key=2aaf60470a34d42b0561e92b17ec7ce2&genres=rap,trance&order=hotness&limit=50";
    request(url, function(err, resp, body) {
        var tracks = [];
        body = JSON.parse(body);
        for (var i = 0; i < body.length; i++) {
            tracks.push(body[i].uri);
        }
        callback(tracks);
    });
}

// recommends the next song for the user
// if user.queue is empty, call soundcloud api
// and build that list, and then pop the value
exports.nextSong = function(req, res) {
    var user = req.user;

    console.log(user._id);

    User.findById(user._id, function(err, dbUser) {
        if (dbUser.queue.length == 0) {
            // call soundcloud api and fill it
            getTracks(function(tracks) {
                var returnTracks = [];
                for (var i = 0; i < 5; i++) {
                    returnTracks.push(tracks.pop());
                }
                dbUser.queue = tracks;
                dbUser.save(function(err, savedUser) {
                    res.send({tracks: returnTracks});
                });
            });
        } else {
            // just pop and send
            var total = Math.min(5, dbUser.queue.length);
            var returnTracks = [];
            for (var i = 0; i < total; i++) {
                returnTracks.push(dbUser.queue.pop());
            }
            dbUser.save(function(err, savedUser) {
                res.send({tracks: returnTracks});
            });
        }
    });
}