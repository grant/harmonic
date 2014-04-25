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
exports.getLastTracks = function(req, res) {
	var fbIds = req.body.fbIds;
    var result = [];

    for (var i = 0; i < fbIds.length; i++) {
        var thisUser = {fbId: fbIds[i]};
        User.findOne({fbId: fbIds[i]}, function(err, user) {
            var lastTrack = user.playlist[user.playlist.length-1];
            var artwork;

            var url = "https://api.soundcloud.com/resolve.json?consumer_key=2aaf60470a34d42b0561e92b17ec7ce2&url=" + lastTrack;
            request(url, function(err, resp, body) {
                body = JSON.parse(body);
                request(body.location, function(err, r, body) {
                    body = JSON.parse(body);
                    artwork = body.artwork_url;
                    thisUser.lastTrack = lastTrack;
                    thisUser.artwork = artwork;
                });
            });
        });
        result.push(thisUser);
    }

    res.send(result);
}
