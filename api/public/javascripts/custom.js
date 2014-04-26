"use strict";

$(document).ready(function() {  	
	$('#user-likes').tooltip({placement: 'top'});
	$('#edit-profile').tooltip({placement: 'top'});
	$("[data-toggle=tooltip]").tooltip();
	$("[rel=tooltip]").tooltip();
});

$(document).ready(function(){
	var vidh = $('.video').height();
	var h4h = $('.rec-prompt').height();
	var footerh = $('.bottom-bar').height();

    $('.search-results').height($(window).height() - vidh - 2*h4h - footerh - 10);
    $('.chat').height($(window).height() - footerh + 30); // all of chat sidebar
    //$('.chat-type').css("marginTop", $(window).height() - 100);
    //$('.chat-messages').height($('.chat').height() - footerh - 2*$('.chat-type').height());

    // aliging the rating buttons so they are next to the video
    var vid_left = parseInt($(".col-sm-6").css("paddingLeft").replace('px', ''));
    var down_right = parseInt($(".col-sm-1").css("paddingRight").replace('px', ''));
    var thumb_height = $(".rate.up").height();
    var vidh = $('iframe.player').height();
    $(".rate.down").css("marginLeft", vid_left + down_right);
    $(".rate.up").css("marginLeft", -vid_left - down_right + 10);
    $(".rate.down").css("marginTop", (vidh - thumb_height) / 2);
    $(".rate.up").css("marginTop", (vidh - thumb_height) / 2);
});


// By Chris Coyier & tweaked by Mathias Bynens
// makes videos responsive
$(function() {

	// Find all YouTube videos
	var $allVideos = $("iframe[src^='http://www.youtube.com']"),

	    // The element that is fluid width
	    $fluidEl = $(".video");

	// Figure out and save aspect ratio for each video
	$allVideos.each(function() {

		$(this)
			.data('aspectRatio', this.height / this.width)
			
			// and remove the hard coded width/height
			.removeAttr('height')
			.removeAttr('width');

	});

	// When the window is resized
	// (You'll probably want to debounce this)
	$(window).resize(function() {

		var newWidth = $fluidEl.width();
		
		// Resize all videos according to their own aspect ratio
		$allVideos.each(function() {

			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));

		});

	// Kick off one resize to fix all videos on page load
	}).resize();

});
