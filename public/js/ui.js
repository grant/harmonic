
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
		onAlbumClick : [],
		onPlaylistEnter : [],
		onPlaylistLeave : [],
		onClickPlaylistSong : [],
		onDropped : []
	};

	var LEFT = 37;
	var RIGHT = 39;

	var dragging = null;
	$('body').append($('<div class="dragging"></div>'));

	//janky
	var oldPlaylistButtonWidth = $('.playlistButton').width();
	var oldPlaylistButtonHeight = $('.playlistButton').height();

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

	function AnimateRotate(angle) {
	    // caching the object for performance reasons
	    var $elem = $('.flyAway:not(".current")');

	    // we use a pseudo object for the animation
	    // (starts from `0` to `angle`), you can name it as you want
	    $({deg: 0}).delay(200).animate({deg: angle}, {
	        duration: 3000,
	        step: function(now) {
	            // in the step-callback (that is fired each step of the animation),
	            // you can use the `now` paramter which contains the current
	            // animation-position (`0` up to `angle`)
	            $elem.css({
	                transform: 'rotate(' + now + 'deg)'
	            });
	        }
	    });
	}

	var flyLeft = function() {
		$('.flyAway').show();
		AnimateRotate(-60);
		$('.flyAway').delay(200).animate({
			opacity: 0.0,
			left: "-=300"
		}, 1000, completeFly);
	};

	var flyRight = function() {
		$('.flyAway').show();
		AnimateRotate(-30);
		$('.flyAway').delay(200).animate({
			opacity: 0.0,
			left: "+=300"
		}, 1000, completeFly);
	};

	var toTrash = function() {
		prepFly();
		for (var i = 0; i < bindings.onLeft.length; i++) {
			bindings.onLeft[i]();
		}
		flyLeft();
	};

	var toPlaylist = function() {
		prepFly();
		for (var i = 0; i < bindings.onRight.length; i++) {
			bindings.onRight[i]();
		}
		flyRight();
	};

	var popOpenPlaylist = function() {
		for (var i = 0; i < bindings.onPlaylistEnter.length; i++) {
			bindings.onPlaylistEnter[i]();
		}
		$('.playlistBody').show();
		$('.playlistButton').animate({
			width: "400px"
		}, 500, completeFly);
	};

	var closePlaylist = function() {
		for (var i = 0; i < bindings.onPlaylistLeave.length; i++) {
			bindings.onPlaylistLeave[i]();
		}
		 $('.playlistBody').hide();
		 $('.playlistButton').animate({
		 	width: oldPlaylistButtonWidth + 'px'
		}, 500);
	};

	var dragAndDropped = function(target, src) {
		for (var i = 0; i < bindings.onDropped.length; i++) {
			bindings.onDropped[i](target, src);
		}
	};

	var clickPlaylistSong = function(clicked) {
		for (var i = 0; i < bindings.onClickPlaylistSong.length; i++) {
			bindings.onClickPlaylistSong[i](clicked);
		}		
		closePlaylist();
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
		return true;
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

	$('.playlistButton').mouseenter(function() {
		$(this).stop();
		if(!$('.playlistButton').hasClass('opened')) {
			$('.playlistButton').toggleClass('opened');
			popOpenPlaylist();
		}
	});

    $(document).mousemove(function(e) {
        $('.dragging').css({
            top: e.pageY + 20,
            left: e.pageX + 20
        });
    });


    $('body').on("mousedown", ".song", function () {
    	$('.dragging').show();
    	$('.dragging').width($(this).width());
    	$('.dragging').height($(this).height());
        $('.dragging').append($(this).clone());
        dragging = $(this);
        return false;
    });

    $('body').on("mouseup", function () {
    	$('.dragging').html('');
    	if($('.playlistButton').hasClass('opened') && dragging != null) {
    		clickPlaylistSong(dragging);
    	} else if ($('.friend.active-drop').length > 0 && dragging != null) {
    		dragAndDropped($('.friend.active-drop')[0], dragging);
    	}
    	dragging = null;
    	$('.friend').removeClass('active-drop');
    	$('.dragging').hide();
        return false;
    });

	$('.playlistButton').mouseleave(function() {
		$(this).stop();
		if($('.playlistButton').hasClass('opened')) {
			$('.playlistButton').toggleClass('opened');
			closePlaylist();
		}
	});

	$('.friend').mouseenter(function() {
		if(dragging != null)
			$(this).addClass('active-drop');
	});


	$('.friend').mouseleave(function() {
		$(this).removeClass('active-drop');
	});

	if(Leap) {
		var controller = new Leap.Controller({enableGestures: true});

		controller.on('gesture', function (gesture){
		    if(gesture.type === 'swipe'){
		        handleSwipe(gesture);
		    }
		});

		function handleSwipe (swipe){
		    var startFrameID;
		    if(swipe.state === 'stop'){
		        if (swipe.direction[0] > 0){
		            //this means that the swipe is to the right direction
		            toPlaylist();
		        }else{
		            //this means that the swipe is to the left direction
		           	toTrash();
		        }
		    }
		}

		controller.connect();
	}

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
		if (typeof passed.onPlaylistLeave != 'undefined')
			bindings.onPlaylistLeave.push(passed.onPlaylistLeave);
		if (typeof passed.onPlaylistEnter != 'undefined')
			bindings.onPlaylistEnter.push(passed.onPlaylistEnter);
		if (typeof passed.onClickPlaylistSong != 'undefined')
			bindings.onClickPlaylistSong.push(passed.onClickPlaylistSong);
		if (typeof passed.onDropped != 'undefined')
			bindings.onDropped.push(passed.onDropped);
		//console.log(bindings);
	}

}


var initUI = function() {
	return new UIViewModel();
}
