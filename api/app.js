/*
    Module dependencies
*/

var express = require('express'),       // the main ssjs framework
    routes = require('./routes'),       // by default, brings in routes/index.js
    user = require('./routes/user'),  // all login for admin panel
    dashboard = require('./routes/dashboard'), // the main app's page
    path = require('path'),             // for pathn manipulation
    db = require('./config/db'),        // database connection
    passport = require('passport'),     // for user authentication
    auth = require('./config/middlewares/authorization'), // helper methods for authentication
    constants = require('./config/constants'),
    app = express(),                    // create an express app
    RedisStore = require('connect-redis')(express); // for persistent sessions

/*
    Configure environments
*/

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
    // the favicon to use for our app
    app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
    // watch network requests to express in realtime
    app.use(express.logger('dev'));
    // allows to read values in a submitted form
    app.use(express.bodyParser());
    // faux HTTP requests - PUT or DELETE
    app.use(express.methodOverride());
    // every file <file> in /public is served at example.com/<file>
    app.use(express.static(path.join(__dirname, 'public')));
    // sign the cookies, so we know if they have been changed
    app.use(express.cookieParser('keyboard cat'));
    // initialize passport
    app.use(passport.initialize());
    // for persistent session logins otherwise each request would need credentials
    app.use(passport.session());
    // make variables available in all templates, provided that req.user is populated.
    // app.use(function(req, res, next) {
    //     res.locals.user = req.user;
    //     res.locals.appName = constants.APP_NAME;
    //     next();
    // });
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

app.get('/logout', auth.requiresLogin, user.logout);

// social signin
// Passport redirects to a facebook login and we ask only for email
app.get('/auth/facebook', passport.authenticate("facebook", {scope:'email'}));
app.get('/auth/facebook/callback', // Authenticates it and sends to dashboard
        passport.authenticate('facebook', function(req, res) { 
            console.log("logged in");
            console.log(req.user);
        })
);


/*
    load helper methods for passport.js
    this is at the end to ensure everything has been loaded/required
*/
require('./config/pass.js')(passport);


// Creates the server and has socets listen to it
app.listen(app.get('port')), { log: false};

console.log('Express server listening on port ' + app.get('port'));
