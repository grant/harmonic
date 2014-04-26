/*
*  Generic require login routing middleware
*/
exports.requiresLogin = function (req, res, next) {
	if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}
