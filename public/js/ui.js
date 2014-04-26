
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
		$('.underlay > .centerContent').append(newFly);
	};

	var completeFly = function() {
		for (var i = 0; i < bindings.onRight.length; i++) {
			bindings.onFlyComplete[i]();
		}
	};

	var flyLeft = function() {
		$('.flyAway').show();
		$('.flyAway').fadeOut('slow', completeFly);
	};

	var flyRight = function() {
		$('.flyAway').show();
		$('.flyAway').fadeOut('slow', completeFly);
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

	$('.left.arrow').click(function () {
		toTrash();
	});

	$('.right.arrow').click(function () {
		toPlaylist();
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