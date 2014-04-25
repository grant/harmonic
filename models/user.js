/*
	Schema for a user.
	Implements field validations, saving to database and
	password comparing.
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema, // Each schema maps to a MongoDB collection
	Constants = require('../config/constants');


// For any user
var userSchema = new Schema({
	created_at: {
		// auto added user registration timestamp
		type: Date,
		default: Date.now
	},
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true // force email lowercase
	},
	accessToken: {
		type: String
	},
	name: {
		type: String
	},
	friends: [],
	photo: {
		type: String
	},
	queue: [{
		songUrl: String,
		byName: String
	}],
	playlist: [String],
	fbId: String,
	online: Boolean
});


module.exports = mongoose.model('User', userSchema);
