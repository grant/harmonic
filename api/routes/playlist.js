var mongoose = require('mongoose');
var User = require('./../models/playlist');

/*
    Add a playlist to the current user
*/
exports.add = function(req, res) {
    res.json({
        'response': 'OK'
    });
}

/*
    Add a song to a playlist
*/
exports.addSong = function(req, res) {
    res.json({
        'response': 'OK'
    });
}

/*
    Remove a song on a playlist
*/
exports.removeSong = function(req, res) {
    res.json({
        'response': 'OK'
    });
}

/*
    Remove a playlist from the current user
*/
exports.delete = function(req, res) {
    res.json({
        'response': 'OK'
    });
}

/*
    Share a playlist with another user
*/
exports.share = function(req, res) {
    res.json({
        'response': 'OK'
    });
}