exports.index = function(req, res){
	// otherwise, render the page
	res.send(req.isAuthenticated());
};
