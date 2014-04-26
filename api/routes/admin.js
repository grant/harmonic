/*
	All our routes.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');
var Constants = require('./../config/constants');
var async = require('async');


var today = new Date(), // returns ISODate
	today_ms = today.getTime(), // returns milliseconds
	yesterday_ms = today_ms - (24 * 60 * 60 * 1000), // milliseconds 24 hours ago
	yesterday = new Date(new Date(yesterday_ms).toISOString()), // yesterday as ISODate
	week_ms = today_ms - (7 * 24 * 60 * 60 * 1000),
	week = new Date(new Date(week_ms).toISOString()),
	month_ms = today_ms - (30 * 24 * 60 * 60 * 1000), // 30 days for now
	month = new Date(new Date(month_ms).toISOString());

/*
	Admin Homepage router.
	View: admin/index
*/
exports.index = function(req, res){
	async.parallel({ 
			// https://github.com/caolan/async#parallel
			// http://www.sebastianseilund.com/nodejs-async-in-practice
			// counts number of users in date ranges
			all_time: function(next) {
				console.log('querying');
				User.count({}, function (err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			past_day: function(next) {
				console.log('querying');
				User.count({'created_at': {$gte: yesterday}}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			week: function(next) {
				console.log('querying');
				User.count({'created_at': {$gte: week}}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			month: function(next) {
				console.log('querying');
				User.count({'created_at': {$gte: month}}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			// Counts number of user signups for each strategy
			local: function(next) {
				console.log('querying');
				User.count({'strategy': 'local'}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			google: function(next) {
				console.log('querying');
				User.count({'strategy': 'google'}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			facebook: function(next) {
				console.log('querying');
				User.count({'strategy': 'facebook'}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			},
			twitter: function(next) {
				console.log('querying');
				User.count({'strategy': 'twitter'}, function(err, count) {
					if (err) return next(err);
					next(null, count);
				});
			}
		}, 
		function(err, r) {
			if (err) throw err;
			res.render('admin/index', {
				title: 'Admin',
				total_users: r.all_time,
				yesterday: r.past_day,
				week: r.week,
				month: r.month,
				local: r.local,
				google: r.google,
				facebook: r.facebook,
				twitter: r.twitter
			})
		}
	);
}


/*
	User management in admin panel.
	View: admin/user_admin
*/
exports.users = function(req, res){
	res.render('admin/user_admin', {
		title: 'User management'
	});
}