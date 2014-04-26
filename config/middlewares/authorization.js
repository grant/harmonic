/*
*  Generic require login routing middleware
*/
exports.requiresLogin = function (req, res, next) {
	if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.redirect_to = req.path;
        res.redirect('/signin');
    }
	
	//req.flash('error', "Sign in before access that.");
	
}
