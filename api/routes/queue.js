var mongoose = require('mongoose');
var User = require('./../models/user');

// recommends the next song for the user
// if user.queue is empty, call soundcloud api
// and build that list, and then pop the value
exports.nextSong = function(req, res) {
    var user = req.user;
    User.findOne({id: user.id}, function(err, user) {
        if (user.queue.length == 0) {
            // call soundcloud api and fill it
            
        }
        // pop the song and return the url
    });
}
