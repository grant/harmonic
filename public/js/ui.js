
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
		onFlyComplete : [],
		onAlbumClick : []
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
		$('.flyAway').remove();
		for (var i = 0; i < bindings.onFlyComplete.length; i++) {
			bindings.onFlyComplete[i]();
		}
	};

	var albumClick = function(clicked) {
		for (var i = 0; i < bindings.onAlbumClick.length; i++) {
			//console.log(typeof bindings.onRight[i]);
			bindings.onAlbumClick[i](clicked);
		}
	};

	var flyLeft = function() {
		$('.flyAway').show();
		$('.flyAway').animate({
			opacity: 0.0,
			left: "-=50"
		}, 500, completeFly);
	};

	var flyRight = function() {
		$('.flyAway').show();
		$('.flyAway').animate({
			opacity: 0.0,
			left: "+=50"
		}, 500, completeFly);
	};

	var toTrash = function() {
		prepFly();
		for (var i = 0; i < bindings.onRight.length; i++) {
			//console.log(typeof bindings.onRight[i]);
			bindings.onRight[i]();
		}
		flyLeft();
	};

	var toPlaylist = function() {
		prepFly();
		for (var i = 0; i < bindings.onLeft.length; i++) {
			//console.log(typeof bindings.onRight[i]);
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

	$('.albumPhoto').click(function() {
		albumClick($(this));
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
		if (typeof passed.onLeft != 'undefined')
			bindings.onLeft.push(passed.onLeft);
		if (typeof passed.onRight != 'undefined')
			bindings.onRight.push(passed.onRight);
		if (typeof passed.onFlyComplete != 'undefined')
			bindings.onFlyComplete.push(passed.onFlyComplete);
		if (typeof passed.onAlbumClick != 'undefined')
			bindings.onAlbumClick.push(passed.onAlbumClick);
		//console.log(bindings);
	}

}


var initUI = function() {
	return new UIViewModel();
}