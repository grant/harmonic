
// Enclosed, Bitch!
function UIViewModel() {
	/**
	 *
	 *
	 *
	 * INTERNAL (PRIVATE)
	 *
	 *
	 * 
	 */

	var self = this;
	var bindings = {
		onLeft : [],
		onRight : [],
		onFlyComplete : []
	};

	var LEFT = 37;
	var RIGHT = 39;

	var prepFly = function() {
		$('.flyAway').remove();
		var contents = $('.underlay').clone();
		contents.find('#widget, .left, .right').remove();
		var newFly = $('<div class="flyAway"></div>');
		newFly.html(contents.html());
		newFly.css({'margin-left' : '-' + ($('.flyAway').width() / 2) + 'px', 'top' : 0, 'left' : '50%'});
		$('body').append(newFly);
	};

	var completeFly = function() {
		for (var i = 0; i < bindings.onRight.length; i++) {
			bindings.onFlyComplete[i]();
		}
	};

	var flyLeft = function() {
		$('.flyAway').show();
		$('.flyAway').animate({
			'left': '0',
			'margin-left': '-' + $('.flyAway').width() + 'px'
		}, 500, completeFly);
	};

	var flyRight = function() {
		$('.flyAway').show();
		$('.flyAway').animate({
			left: '100%'
		}, 500, completeFly);
	};

	var toTrash = function() {
		prepFly();
		for (var i = 0; i < bindings.onRight.length; i++) {
			bindings.onRight[i]();
		}
		flyLeft();
	};

	var toPlaylist = function() {
		prepFly();
		for (var i = 0; i < bindings.onRight.length; i++) {
			bindings.onLeft[i]();
		}
		flyRight();
	};

	/**
	 *
	 *
	 * JQUERY BINDINGS
	 *
	 *
	 * 
	 */

	$(document).keydown(function (e) {
		if(e.which == LEFT) {
			toTrash();
		} else if(e.which == RIGHT) {
			toPlaylist();
		}
	});


	/**
	 *
	 *
	 *
	 * EXTERNAL FUNCTIONALITY
	 *
	 *
	 * 
	 */

	self.addBinds = function(passed) {
		$.extend(true, bindings, passed);
	}

}


var initUI = function() {
	return new UIViewModel();
}