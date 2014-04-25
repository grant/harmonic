
// Enclosed, Bitch!
function UIViewModel() {
	var LEFT = 37;
	var RIGHT = 39;

	var prepFly = function() {
		var contents = $('.centerContent').clone();
		//$('.flyaway')
	};

	var toTrash = function() {

	};

	var toPlaylist = function() {

	};

	$(document).keydown(function (e) {
		if(e.which == LEFT) {
			toTrash();
		} else if(e.which == RIGHT) {
			toPlaylist();
		}
	});
}


var initUI = function() {
	new UIViewModel();
}