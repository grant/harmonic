
/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: 'Harmonic' });
};

exports.play = function (req, res) {
  if (!req.user)
  	res.redirect('/');
  else
	res.render('play', {
	  		title: 'Play -- Harmonic',
	        name: req.user.name, 
	        photo: req.user.photo});
};

exports.authError = function(req, res) {
  res.render('index', { success: 'false' });
};

exports.authSuccess = function(req, res) {
  res.render('play', {
        success: 'true', 
        name: req.user.name, 
        photo: req.user.photo
    });
};
