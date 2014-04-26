"use strict";

// Initializes the app
SC.initialize({
  client_id: 'edefe43facff0422cfa99623ffec3ab4'
});


// Given the stream id it will stream the song using the sdk
function stream(id) {
	/*SC.stream("/tracks/" + id, function(sound) {
			sound.play();
			console.log('Playing song: ' + sound);
	});*/
	SC.Widget('sc-widget').load("http://api.soundcloud.com/tracks/" + id, {show_artwork: true});
	SC.Widget('sc-widget').setVolume(100);
}

// Shitty search funtionality
$('#search').click(function() {
	var title = $('#search_box').val();
	console.log("Searching for: " + title);
	//console.log('hi');
	// Will search for the track
	SC.get('/tracks', { q: title}, function (tracks) {
		if (!tracks) {
			console.log("no tracks found");
		} else {
			// filters only the songs we can stream
			var playable = tracks.filter(function(val, i, arr) { return val.streamable });
			
			if (!playable) console.log('no songs able to stream');

			// puts the most played songs in the front
			playable.sort(function(a, b) {
				return b.playback_count - a.playback_count;
			});
		}

		insertResults(Math.min(playable.length, 10), playable);

		console.log(playable);

		// All the tracks should be able to play song
		$('.tracks').click(songClick);

			
	});
});

/*
	I think this is where if we want to make a quue on the backend it could
	send other user.id, song id.
	This gives us the information of who the song is giong to and what song to stream.
	It isn't the most elegant way to do it but i think if we want to make it work this could
*/
function songClick() { 
	stream(this.id);
}

/*
	Inserts the playble songs into the serach 
	results becuase angular is hard
*/
function insertResults(showAmount, playable) {
	$('#results').empty();
	// Because fuck angular
	for (var i = 0; i < showAmount; i++) {
		var title = playable[i].title;
		var artist = playable[i].user.username;
		var id = playable[i].id;
		var track = '<a class="list-group-item search-result tracks" id=' + id + '>' +
					title + ' - ' + artist + '</a>';
		$('#results').append(track);
	}
}
