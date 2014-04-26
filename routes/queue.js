var mongoose = require('mongoose');
var User = require('./../models/user');
var request = require('request');

function getTracks(callback) {
    var url = "https://api.soundcloud.com/tracks.json?consumer_key=2aaf60470a34d42b0561e92b17ec7ce2&genres=rap,trance&order=hotness";
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
    console.log(user);

    User.findOne({id: user._id}, function(err, dbUser) {
        console.log(dbUser);
        if (dbUser.queue.length == 0) {
            // call soundcloud api and fill it
            getTracks(function(tracks) {
                User.update(dbUser, {$pushAll: {queue: tracks}}, {upsert:true}, function(err) {
                    console.log("Successfully added");
                });
            });
        }
        // pop the song and return the url
        User.findOne({id: user.id}, function(err, dbUser) {
            console.log(user.queue);
        });

    });
}
