/*
    Holds app-wide constants.
    Usage: 
        var Constants = require(./config/Constants);
        console.log(Constants.APP_NAME);
*/

var Constants = {
    // The name of the app
    APP_NAME: "Harmonic", 
    // Appid and secret are used to connect with facebook app, can't be shared
    Facebook: {
        APPID : '631801513573798',
        SECRET : '3e9733b7a5db17fa21f79158042d584a',
        CALLBACK : 'http://www.goharmonic.com/auth/facebook/callback'
    }
};

module.exports = Constants;
