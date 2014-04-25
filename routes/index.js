
/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: 'Harmonic' });
};

exports.play = function (req, res) {
  if (!req.user) {
  	res.redirect('/');
  } else {
  	res.render('play', {
  		title: 'Play -- Harmonic',
      name: req.user.name,
      photo: req.user.photo,
      accessToken: req.user.accessToken
    });
  }
};

exports.authError = function(req, res) {
  res.render('index', { success: 'false' });
};

exports.authSuccess = function(req, res) {
  res.redirect('/play');
};
