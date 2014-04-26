/*
	Schema for a playlist.
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema, // Each schema maps to a MongoDB collection
	Constants = require('../config/constants');


// For any playlist
var playlistSchema = new Schema({
	created_at: {
		type: Date,
		default: Date.now
	},
	songs: {
		type: String,
		unique: true
	}
});


module.exports = mongoose.model('Playlist', userSchema);
