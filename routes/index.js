
/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: 'Harmonic' });
};

exports.play = function (req, res) {
  res.render('play', { title: 'Play -- Harmonic' });
};