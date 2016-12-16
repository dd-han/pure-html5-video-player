var createPlayer  = function() {
  throw("this function not working");

  var video = document.createElement("video");
  document.body.appendChild(video);
}

var player = function(containerID,files,config) {
  // for internal access
  var playlist = [];
  var DOMs = {
    container: {},
    video: {},
    seekbar: {},
    playSpeedInfo: {},
    loadingHint: {}
  }

  var playStatus = {
    buffering: false,
    playlistIndex: 0,
  };

  // public access function
  this.DOMs = DOMs; // debug using
  this.playlist = playlist;

  this.setSpeed = function(speed) {
    DOMs.video.playbackRate = speed;
    DOMs.playSpeedInfo.innerHTML = DOMs.video.playbackRate;
  }

  var playVideo = function() {
    DOMs.video.play();
  }
  this.playVideo = playVideo;

  var pauseVideo = function() {
    DOMs.video.pause();
  }
  this.pauseVideo = pauseVideo;

  var videoLaddedmetadataAction = function(event) {
    //var duration = DOMs.video.duration;
    //playlist[playStatus.playlistIndex].duration = duration;
    //console.log("meta loaded",duration);
  }

  var videoTimeupdateAction = function(event) {
    var duration = DOMs.video.duration;
    var position = event.target.played.end(0);
    var seekbarValue = position / duration;
    DOMs.seekbar.value = seekbarValue;
    console.log("video time updated", position);
  }

  var videoProgressAction = function(event) {
    console.log("download some content");
  }

  // on play only works on resume from pause
  var videoPlayAction = function(event) {
    // seekbar updater
    //playStatus.checkTimer = setInterval(checkTimerAction,100);
  }

  // onplaying works on anything that resume playing like buffered
  var videoPlayingAction = function(event) {
    if (playStatus.buffering) {
      console.log("buffered");
      loadingHintDisplay(false);
    }
    // seekbar updater
    //playStatus.checkTimer = setInterval(checkTimerAction,100);
  }

  var videoPauseAction = function(event) {
    //clearInterval(playStatus.checkTimer);
  }

  var videoEndAction = function(event) {
    playStatus.playlistIndex += 1;
    if (playStatus.playlistIndex < playlist.length) {
      loadVideo();
      playVideo();
    } else {
      console.log("ended");
    }
  }

  var loadingAction = function() {
    loadingHintDisplay(true);
    playStatus.buffering = true;
  };

  var loadVideo = function() {
    DOMs.video.src = playlist[playStatus.playlistIndex].file;
  }

  // low level functions
  var loadingHintDisplay = function(showOrNot) {
    if (showOrNot) {
      DOMs.loadingHint.style.display="";
    } else {
      DOMs.loadingHint.style.display="none";
    }
  }

  // inits
  var initDOMs = function() {
    // find doms
    DOMs.container = document.getElementById(containerID);
    DOMs.video = DOMs.container.getElementsByTagName("video")[0];
    DOMs.playSpeedInfo = DOMs.container.getElementsByClassName("play-speed-info")[0];
    DOMs.loadingHint = DOMs.container.getElementsByClassName("loading-hint")[0];
    DOMs.seekbar = DOMs.container.getElementsByClassName("seekbar")[0];
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
  }
  var initPlayerEvents = function() {
    DOMs.video.onwaiting = loadingAction;
    DOMs.video.onended = videoEndAction;
    DOMs.video.onplay = videoPlayAction;
    DOMs.video.onplaying = videoPlayingAction;
    DOMs.video.onpause = videoPauseAction;
    DOMs.video.onprogress = videoProgressAction;
    DOMs.video.ontimeupdate = videoTimeupdateAction;
    DOMs.video.onloadedmetadata = videoLaddedmetadataAction;
  }

  // constractor here
  initDOMs();
  initPlayerEvents();
  initPlayer();

  loadVideo();
  playVideo();
}
