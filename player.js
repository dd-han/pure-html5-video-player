var autoPlay = true;

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
    loadingHint: {},
    play: {},
    pause: {},
    stop: {}
  }

  var playStatus = {
    buffering: false,
    playlistIndex: 0,
    dragging: false,
    playSpeed: 1,
  };


  // public access function
  this.DOMs = DOMs; // debug using
  this.playlist = playlist;
  this.playStatus = playStatus;

  var setSpeed = function(speed) {
    playStatus.playSpeed = speed;
    DOMs.video.playbackRate = speed;
    DOMs.playSpeedInfo.innerHTML = DOMs.video.playbackRate;
  }
  this.setSpeed = setSpeed;

  // prettify code
  var unattend = true;
  var playVideo = function(unattend) {
    if (unattend && !autoPlay) {
      return 0;
    }
    showPauseBtn(true);
    showPlayBtn(false);
    DOMs.video.play();
  }
  this.playVideo = playVideo;

  var pauseVideo = function() {
    showPauseBtn(false);
    showPlayBtn(true);
    DOMs.video.pause();
  }
  this.pauseVideo = pauseVideo;

  var stopVideo = function() {
    showPauseBtn(false);
    showPlayBtn(true);
    resetEnv();
  }
  this.stopVideo = stopVideo;

  var seekbarInputAction = function(event) {
    playStatus.dragging = true;
  }

  var seekbarChangeAction = function(event) {
    playStatus.dragging = false;
    var seekbarValue = event.target.value;
    var videoTime = DOMs.video.duration * seekbarValue;
    DOMs.video.currentTime = videoTime;
  }

  var videoLaddedmetadataAction = function(event) {
    //var duration = DOMs.video.duration;
    //playlist[playStatus.playlistIndex].duration = duration;
    //console.log("meta loaded",duration);
  }

  var videoTimeupdateAction = function(event) {
    console.log("video time updated");
    if (playStatus.dragging===true) {
      return 0;
    }
    try {
      var duration = DOMs.video.duration;
      var position = event.target.currentTime;
      var seekbarValue = position / duration;
      DOMs.seekbar.value = seekbarValue;
      console.log("video time updated", position);
    } catch (e) {
      console.log("unable to update video timer");
    }
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
      showLoadingHintDisplay(false);
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
      setSpeed(playStatus.playSpeed);
      playVideo(unattend);
    } else {
      console.log("ended");
    }
  }

  var loadingAction = function() {
    showLoadingHintDisplay(true);
    playStatus.buffering = true;
  };

  var loadVideo = function() {
    DOMs.video.src = playlist[playStatus.playlistIndex].file;
  }

  // low level functions
  var showLoadingHintDisplay = function(show) {
    showHideDOM(show,DOMs.loadingHint);
  }
  var showPauseBtn = function(show) {
    showHideDOM(show,DOMs.pause);
  }
  var showPlayBtn = function(show) {
    showHideDOM(show,DOMs.play);
  }
  var showHideDOM = function(show,DOM) {
    if (show) {
      DOM.style.display="";
    } else {
      DOM.style.display="none";
    }
  }

  var resetEnv = function() {
    playStatus.playlistIndex = 0;
    loadVideo();
    setTimeout(function() {
      DOMs.seekbar.value = 0;
    },100);

    playStatus = {
      buffering: false,
      playlistIndex: 0,
      dragging: false,
      playSpeed: 1,
    };

    //DOMs.video.currentTime = 0;
  }

  // inits
  var initDOMs = function() {
    // find doms
    DOMs.container = document.getElementById(containerID);
    DOMs.video = DOMs.container.getElementsByTagName("video")[0];
    DOMs.playSpeedInfo = DOMs.container.getElementsByClassName("play-speed-info")[0];
    DOMs.loadingHint = DOMs.container.getElementsByClassName("loading-hint")[0];
    DOMs.seekbar = DOMs.container.getElementsByClassName("seekbar")[0];
    DOMs.pause = DOMs.container.getElementsByClassName("pause")[0];
    DOMs.play = DOMs.container.getElementsByClassName("play")[0];
    DOMs.stop = DOMs.container.getElementsByClassName("stop")[0];
    showPauseBtn(false);
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
  var initButtonEvent = function() {
    DOMs.pause.onclick = pauseVideo;
    DOMs.play.onclick = playVideo;
    DOMs.stop.onclick = stopVideo;
    DOMs.seekbar.oninput = seekbarInputAction;
    DOMs.seekbar.onchange = seekbarChangeAction;
  }

  // constractor here
  initDOMs();
  initPlayerEvents();
  initPlayer();
  initButtonEvent();

  loadVideo();
  playVideo(unattend);
}
