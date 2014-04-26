$(function () {

  // initUI();

  var client_id = '2aaf60470a34d42b0561e92b17ec7ce2';
  var currentQueue = []; // holds the queue of songs
  var audioElem = $("#widget")[0];

  // initialize SC add
  SC.initialize({
    client_id: client_id
  });

  // on page load, get and play something
  playNext();


  function playNext() {
    // update the audio tag source
    if (currentQueue.length == 0) {
      // empty queue, get more songs
      $.get( "/nextsong", function(data) {
        currentQueue = data.tracks;
        console.log(currentQueue);
        // play the first song
        var url = currentQueue.pop().songUrl;
        console.log(url);
        SC.get(url, {}, function(sound, error) {
          $('#widget').attr('src', sound.stream_url + '?client_id=' + client_id);
        });
      });
    }
  }

var socket = io.connect();
  console.log('playing song');
});

});
