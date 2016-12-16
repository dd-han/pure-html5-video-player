var createPlayer  = function() {
  throw("this function not working");

  var video = document.createElement("video");
  document.body.appendChild(video);
}

var player = function(containerID,files,config) {
  // for internal access
  var DOMs = {
    container: {},
    video: {},
    playSpeedInfo: {},
    loadingHint: {}
  }

  var playStatus = {
    playlistIndex: 0,
  };

  var playlist = [];

  // public access function
  this.DOMs = DOMs; // debug using
  this.playlist = playlist;

  this.setSpeed = function(speed) {
    DOMs.video.playbackRate = speed;
    DOMs.playSpeedInfo.innerHTML = DOMs.video.playbackRate;
  }

  var loadingHintDisplay = function(showOrNot) {
    if (showOrNot) {
      DOMs.loadingHint.style.display="";
    } else {
      DOMs.loadingHint.style.display="none";
    }
  }

  var videoEndAction = function() {
    playStatus.playlistIndex += 1;
    if (playStatus.playlistIndex < playlist.length) {
      playVideo();
    } else {
      console.log("ended");
    }

  }

  var playVideo = function() {
    DOMs.video.src = playlist[playStatus.playlistIndex].file;
    DOMs.video.play();
  }

  // inits
  var initDOMs = function() {
    // find doms
    DOMs.container = document.getElementById(containerID);
    DOMs.video = DOMs.container.getElementsByTagName("video")[0];
    DOMs.playSpeedInfo = DOMs.container.getElementsByClassName("play-speed-info")[0];
    DOMs.loadingHint = DOMs.container.getElementsByClassName("loading-hint")[0];
  }
  var initPlayer = function() {
    // setup player
    DOMs.video.controls = config.defaultControls;
    DOMs.video.style.width = config.playerWidth;
    DOMs.video.style.height = config.playerHeight;

    // setup player file
    for (index in files) {
      playlist.push({file: files[index]});
    }

    playVideo();
  }
  var initPlayerEvents = function() {
    // add buffer event
    DOMs.video.onwaiting = function() {
      loadingHintDisplay(true);
      var loadingInterval = setInterval(function() {
        var state = DOMs.video.readyState;
        if (state == 4) {
          loadingHintDisplay(false);
          clearInterval(loadingInterval);
        }
      },100);
    };
      
    // add events
    DOMs.video.onended = videoEndAction;
  }

  // constractor here
  initDOMs();
  initPlayer();
  initPlayerEvents();

}
