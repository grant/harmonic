$(function () {

  var ui = initUI();

  var client_id = '2aaf60470a34d42b0561e92b17ec7ce2';
  var starttimeoffset = 30; // what time do we skip to?
  var duration = 20; // duration of track

  var currentURL = "";

  var currentQueue = []; // holds the queue of songs
  var audioElem = $("#widget")[0];

  // initialize SC add
  SC.initialize({
    client_id: client_id
  });

  progressJs(".progress").start();

  audioElem.addEventListener("canplay", function() { 
    audioElem.currentTime = starttimeoffset;
  }, true);

  audioElem.addEventListener("timeupdate", function() { 
    var curTime = audioElem.currentTime;
    if (curTime >= starttimeoffset + duration) {
      $(".photo").addClass("stopped");
      $(".progressjs-progress").hide();
      $('#animated-1').attr('dur', '50s');
      $('#animated-2').attr('dur', '30s');
      // audioElem.pause();
      playNext();
    }
    var diff = curTime - starttimeoffset;
    progressJs(".progress").set((diff/duration)*100);
  }, true);

  var playNext = function() {
    // update the audio tag source
    if (currentQueue.length == 0) {
      // empty queue, get more songs
      $.get( "/nextsong", function(data) {
        currentQueue = data.tracks;
        // play the first song
        var url = currentQueue.pop().songUrl;
        playOne(url);
      });
    } else {
      var url = currentQueue.pop().songUrl;
      playOne(url);
    }
  }

  function playOne(url) {
    currentURL = url;
    SC.get(url, {}, function(sound, error) {
      if (sound.stream_url) {
        $(".photo").removeClass("stopped");
        $('#animated-1').attr('dur', '3s');
        $('#animated-2').attr('dur', '1.8s');
        $(".progressjs-progress").show();
        progressJs(".progress").set(0);
        $('#widget').attr('src', sound.stream_url + '?client_id=' + client_id);
        $('#song-title').html(sound.title);
        $('#song-author').html('By <a target="_blank" href="' + sound.user.permalink_url + '">' + sound.user.username + '</a>');
        if (sound.artwork_url) {
          var img = $('<img/>').attr('src', sound.artwork_url.replace("large", "crop"));
          img.addClass("current");
        } else {
          var img = $('<img/>').attr('src', "/images/default.png");
          img.addClass("current");
        }
        $(".underlay > .centerContent > .photo").html(img);
        audioElem.volume = 1;
        audioElem.play();
      } else {
        playNext();
      }
    });
  }

  function updateTrackList() {
    $.get('/playlist', function(data) {
      $('.likedSongs').html('');
      for(var i = 0; i < data.tracks.length; i++) {
        // var track = getTrackDetails(data.tracks[i]);
        getTrackDetails(data.tracks[i], function(track) {
          var image = track.artwork_url || '/images/default.png';
          $('.likedSongs').append('<li class="song" data-url="' + track.uri + '"><span class="name">' + track.title + '</span><img src="' + image + '" class="albumPhoto" /></li>');
        });
      }
    });
  }

  function getTrackDetails(t, callback) {
    // url = t.replace("tracks/", "tracks.json?")+"&client_id="+client_id;
    url = t+".json?consumer_key="+client_id;
    $.get(url, function(data) {
      callback(data);
    });
  }

  function saveTrack() {
    $.post('/playlist', {'songURL' : currentURL}, function(data) {
      $('.likedSongs').html('');
      for(var i = 0; i < data.tracks.length; i++) {
        getTrackDetails(data.tracks[i], function(track) {
          var image = track.artwork_url || '/images/default.png';
          $('.likedSongs').append('<li class="song" data-url="' + track.uri + '"><span class="name">' + track.title + '</span><img src="' + image + '" class="albumPhoto" /></li>');
        });
      }
    });
    playNext();
  }

  function sendRecommendation(target, src) {
    console.log(target);
    console.log(src);
  }

  ui.addBinds({
    onLeft : playNext,
    onRight : saveTrack,
    onPlaylistEnter : updateTrackList,
    onClickPlaylistSong : function(clicked) {
      var url = clicked.data('url');
      playOne(url);
    },
    onDropped : sendRecommendation
  });

  // on page load, get and play something
  playNext();

  var socket = io.connect();
  var idIsValid = false;
  socket.on('connected', function (data) {
    socket.emit('identification', $('.accessToken').text());
  });

  socket.on('identification', function (success) {
    idIsValid = success;
    socket.emit('updatePlaylist');
  });

  setInterval(function () {
    socket.emit('updatePlaylist');
  }, 5000);

  socket.on('updateFriends', function (data) {
    $('.friends').html('');
    for(var i = 0; i < data.length; i++) {
      var imageUrl = 'http://graph.facebook.com/' + data[i].fbId + '/picture';
      $('.friends').append('<div class="friend" data-fbId="' + data[i].fbId + '"><div class="slideArea"><div class="songName">' + data[i].lastTrack + '</div><img src="' + data[i].artwork + '" class="albumPhoto"></div><img src="' + imageUrl + '" class="profilePhoto"></div>');
    }
  });
});
