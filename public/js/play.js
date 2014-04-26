$(function () {

  var ui = initUI();

  var client_id = '2aaf60470a34d42b0561e92b17ec7ce2';
  var starttimeoffset = 30; // what time do we skip to?
  var duration = 20; // duration of track

  var currentQueue = []; // holds the queue of songs
  var audioElem = $("#widget")[0];

  // initialize SC add
  SC.initialize({
    client_id: client_id
  });

  audioElem.addEventListener("canplay", function() {
    audioElem.currentTime = starttimeoffset;
  }, true);

  audioElem.addEventListener("timeupdate", function() {
    if (audioElem.currentTime >= starttimeoffset + duration) {
      playNext();
    }
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
    SC.get(url, {}, function(sound, error) {
      if (sound.stream_url) {
        $('#widget').attr('src', sound.stream_url + '?client_id=' + client_id);
        if (sound.artwork_url) {
          var img = $('<img/>').attr('src', sound.artwork_url.replace("large", "crop"));
        } else {
          var img = $('<img/>').attr('src', "/images/default.png");
        }
        $(".photo").html(img)
        audioElem.play();
      } else {
        playNext();
      }
    });
  }

  ui.addBinds({
  	onLeft : playNext,
  	onRight : playNext
  });
  // $(".arrow").click(function() {
  //   playNext();
  // });


  // on page load, get and play something
  playNext();

  var socket = io.connect();
});
