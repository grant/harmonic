/*
	The dashboard aka main app.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');

/*
	Renders the main page of dashboard
	View: dashboard/dashboard
*/
exports.index = function(req, res) {
	user = req.user;
	res.render('dashboard/dashboard', {
		user: user,
		title: 'Dashboard'
	});
}
