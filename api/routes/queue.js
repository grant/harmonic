var mongoose = require('mongoose');
var User = require('./../models/user');

// recommends the next song for the user
// if user.queue is empty, call soundcloud api
// and build that list, and then pop the value
exports.nextSong = function(req, res) {
    var user = req.user;

}
