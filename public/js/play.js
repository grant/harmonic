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

  progressJs(".progress").start();

  audioElem.addEventListener("canplay", function() { 
    audioElem.currentTime = starttimeoffset;
  }, true);

  audioElem.addEventListener("timeupdate", function() { 
    var curTime = audioElem.currentTime;
    if (curTime >= starttimeoffset + duration) {
      $(".photo").addClass("stopped");
      $(".progressjs-progress").hide();
      // playNext();
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
        console.log(currentQueue);
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
        $(".photo").removeClass("stopped");
        $(".progressjs-progress").show();
        progressJs(".progress").set(0);
        $('#widget').attr('src', sound.stream_url + '?client_id=' + client_id);
        if (sound.artwork_url) {
          var img = $('<img/>').attr('src', sound.artwork_url.replace("large", "crop"));
        } else {
          var img = $('<img/>').attr('src', "/images/default.png");
        }
        $(".photo").html(img)
        audioElem.volume = 0;
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

  // on page load, get and play something
  playNext();

  var socket = io.connect();
});
