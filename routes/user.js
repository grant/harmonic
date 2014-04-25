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
}

/*
	Get friends that are logged in
 */
exports.getOnlineFriends = function(user) {
	var friends = user.friends;
}