var express = require('express'),       // the main ssjs framework
    routes = require('./routes'),       // by default, brings in routes/index.js
    queue = require('./routes/queue'),
    user = require('./routes/user'),
    playlist = require('./routes/playlist'),
    path = require('path'),             // for pathn manipulation
    db = require('./config/db'),        // database connection
    passport = require('passport'),     // for user authentication
    auth = require('./config/middlewares/authorization'), // helper methods for authentication
    constants = require('./config/constants'),
    app = express(),                    // create an express app
    RedisStore = require('connect-redis')(express); // for persistent sessions

// Socket.IO
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.configure('production', function(){
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging
  // enable all transports (optional if you want flashsocket)
  io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
});

var lastUpdateTime = (new Date()).getTime();
io.sockets.on('connection', function (socket) {
  var thisSocketFbId;
  socket.emit('connected');

  // Sets up the user data
  socket.on('identification', function (accessToken) {
    user.getUserFromToken(accessToken, function (err, thisUser) {
      socket.user = thisUser;
      thisSocketFbId = thisUser.fbId;
      user.setOnline(thisUser._id, true, function () {
        socket.emit('identification', true);
      });
    });
  });

  // When the playlist is updated
  socket.on('updatePlaylist', function () {
    // updatePlaylist
    var thisUpdateTime = (new Date()).getTime();
    if (thisUpdateTime - lastUpdateTime > 1000) {
      lastUpdateTime = thisUpdateTime;
      for (var i in io.sockets.clients()) {
        var userData = io.sockets.clients()[i].user;
        user.getLastTracks(userData, function (err, friendData) {
          socket.emit('updateFriends', friendData);
        });
      }
    }
  });

  socket.on('disconnect', function () {
    var userData = socket.user;
    if (userData) {
      user.setOnline(userData._id, false);
    }
  });
});

/*
    Configure environments
*/

var redis;
if (process.env.REDISTOGO_URL) {
    console.log("using reditogo");
    rtg   = require('url').parse(process.env.REDISTOGO_URL);
    redis = require('redis').createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
} else {
    console.log("using local redis");
    redis = require("redis").createClient();
}

app.configure(function(){
    // read port from .env file
    app.set('port', process.env.PORT || 8888);
    // locate the views folder
    app.set('views', __dirname + '/views');
    // we are using jade templating engine
    app.set('view engine', 'jade');
    app.use(function(req, res, next) {
        if (req.url != '/favicon.ico') {
            return next();
        } else {
            res.status(200);
            res.header('Content-Type', 'image/x-icon');
            res.header('Cache-Control', 'max-age=4294880896');
            res.end();
        }
    });
    // every file <file> in /public is served at example.com/<file>
    app.use(express.static(path.join(__dirname, 'public')));
    // watch network requests to express in realtime
    app.use(express.logger('dev'));
    // allows to read values in a submitted form
    app.use(express.bodyParser());
    // faux HTTP requests - PUT or DELETE
    app.use(express.methodOverride());
    // sign the cookies, so we know if they have been changed
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({
        secret: 'YOLO',
        store: new RedisStore({ client: redis })
    }));
    // initialize passport
    app.use(passport.initialize());
    app.use(passport.session());
    // invokes the routes' callbacks
    app.use(app.router);
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*
    URL routes
*/

// homepage
app.get('/', routes.index);
app.get('/play', routes.play);

app.get('/logout', auth.requiresLogin, user.logout);

// social signin
// Passport redirects to a facebook login and we ask only for email
app.get('/auth/facebook', passport.authenticate("facebook", {scope:'email'}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/error' }), routes.authSuccess);
app.get('/auth/error', routes.authError);

app.get('/nextsong', auth.requiresLogin, queue.nextSong);
app.post('/recommendsong', auth.requiresLogin, queue.recommend);

// Playlist endpoints
app.get('/playlist', auth.requiresLogin, playlist.getAll);
app.post('/playlist', auth.requiresLogin, playlist.addSong);
app.del('/playlist', auth.requiresLogin, playlist.removeSong);
app.post('/playlist/share', auth.requiresLogin, playlist.share);

app.get('/allonlinefriends', auth.requiresLogin, user.getLastTracksURL);

/*
    load helper methods for passport.js
    this is at the end to ensure everything has been loaded/required
*/
require('./config/pass.js')(passport);

// Creates the server and has socets listen to it
server.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
