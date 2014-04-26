var mongoose = require('mongoose');
var User = require('./../models/user');

/*
    Add a song to a playlist
*/
exports.addSong = function(req, res) {
	User.update(
		{'_id' : req.user._id},
		{ $addToSet: { 
			playlist : req.body.songURL
		} }, 
		function(err) {
			if (err)
				console.log(err);
			User.findOne({'_id': req.user._id}, function(err, user) {
				res.json({
					'response': 'OK',
					'tracks': user.playlist
				});
			});
		});
}

/*
    Remove a song on a playlist
*/
exports.removeSong = function(req, res) {
	User.update(
		{'_id' : req.user._id},
		{ $pull: { 
			playlist : req.body.songURL
		} }, 
		function(err) {
			if (err)
				console.log(err);
			User.findOne({'_id': req.user._id}, function(err, user) {
				res.json({
					'response': 'OK',
					'tracks': user.playlist
				});
			});
		});
}

// get all songs in a user's playlist
exports.getAll = function(req, res) {
	User.findById(req.user.id, function(err, user) {
		res.send({tracks: user.playlist});
	});
}

/*
    Share a playlist with another user
*/
exports.share = function(req, res) {
	/*
		TODO
	 */
    res.json({
        'response': 'OK'
    });
}
