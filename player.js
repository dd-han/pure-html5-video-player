var autoPlay = true;
// undefined will show or hide field by video duration
var alwaysShowHour = undefined;
var alwaysShowMinute = undefined;
var alwaysShowSecond = true;
var alwaysShowMS = false;

var createPlayer  = function() {
  throw("this function not working");

  var video = document.createElement("video");
  document.body.appendChild(video);
}

var player = function(containerID,files,config) {
  // for internal access
  var playlist = [];
  var DOMs = {};

  var playStatus = {
    buffering: false,
    playlistIndex: 0,
    dragging: false,
    playSpeed: 1,
    durationInfo: {
      hour: alwaysShowHour,
      minute: alwaysShowMinute,
      second: alwaysShowSecond,
      ms: alwaysShowMS
    }
  };


  // public access function
  this.DOMs = DOMs; // debug using
  this.playStatus = playStatus;
  this.playlist = playlist;
  this.playStatus = playStatus;

  var setSpeed = function(speed) {
    playStatus.playSpeed = speed;
    DOMs.video.playbackRate = speed;
    DOMs.speedInfo.innerHTML = DOMs.video.playbackRate;
  }
  this.setSpeed = setSpeed;

  // prettify code
  var unattend = true;
  var playVideo = function(unattend) {
    if (unattend && !autoPlay) {
      return 0;
    }
    showPauseOrPlay(pauseButton);
    DOMs.video.play();
  }
  this.playVideo = playVideo;

  var pauseVideo = function() {
    showPauseOrPlay(playButton);
    DOMs.video.pause();
  }
  this.pauseVideo = pauseVideo;

  var stopVideo = function() {
    showPauseOrPlay(playButton);
    resetEnv();
  }
  this.stopVideo = stopVideo;


  // event actions (most private)
  var videoErrorAction = function(event) {
  
    // error code here: http://www.w3schools.com/tags/av_prop_error.asp
    var error = event.target.error;
    switch (event.target.error.code) {
     case error.MEDIA_ERR_ABORTED:
       alert('MEDIA_ERR_ABORTED');
       break;
     case error.MEDIA_ERR_NETWORK:
       alert('MEDIA_ERR_NETWORK');
       break;
     case error.MEDIA_ERR_DECODE:
       alert('MEDIA_ERR_DECODE');
       break;
     case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
       alert('MEDIA_ERR_SRC_NOT_SUPPORTED');
       break;
     default:
       alert('An unknown error occurred.');
       break;
    }
    //resetEnv();
  }

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
    var duration = DOMs.video.duration;
    updateDurationInfo(formatTimeString(duration,true));
    //playlist[playStatus.playlistIndex].duration = duration;
    //console.log("meta loaded",duration);
  }

  var videoTimeupdateAction = function(event) {
    if (playStatus.dragging===true) {
      return 0;
    }
    try {
      var duration = DOMs.video.duration;
      var position = event.target.currentTime;
      var positionString = formatTimeString(position);
      updatePositionInfo(positionString);
      var seekbarValue = position / duration;
      updateSeekbarPos(seekbarValue);
    } catch (e) {
      console.warn("unable to update video time");
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
  var updateSeekbarPos = function(seekbarValue) {
    DOMs.seekbar.value = seekbarValue;
  }
  var updateDurationInfo = function(value) {
    DOMs.durationInfo.innerHTML = value;
  }
  var updatePositionInfo = function(value) {
    DOMs.positionInfo.innerHTML = value;
  }
  var showLoadingHintDisplay = function(show) {
    showHideDOM(show,DOMs.loadingHint);
  }
  var playButton = true;
  var pauseButton = false;
  var showPauseOrPlay = function(button) {
    if (button) {
      showPauseBtn(false);
      showPlayBtn(true);
    } else {
      showPauseBtn(true);
      showPlayBtn(false);
    }
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
      durationInfo: {
        hour: alwaysShowHour,
        minute: alwaysShowMinute,
        second: alwaysShowSecond,
        ms: alwaysShowMS
      }
    }
    //DOMs.video.currentTime = 0;
  }
  var formatTimeString = function(time,updateDurationState) {
    var timeObject = formatTime(time,updateDurationState);
    var returnString = ""
    
    if (playStatus.durationInfo.ms===true) {
      returnString = "." + leftpad(timeObject.ms,3,"0");
    }

    if (playStatus.durationInfo.second) {
      returnString = leftpad(timeObject.second,2,"0") + returnString;
    }

    if (playStatus.durationInfo.minute) {
      returnString = leftpad(timeObject.minute,2,"0") + ":" + returnString;
    }

    if (playStatus.durationInfo.hour) {
      returnString = leftpad(timeObject.hour,2,"0") + ":" + returnString;
    }

    return returnString;
  }
  this.formatTimeString = formatTimeString;
  var formatTime = function(time,updateState) {
    var timeObject = {};
    var durationInfo = playStatus.durationInfo;

    // format second to second + ms
    timeObject.ms = time % 1;
    timeObject.second = time - timeObject.ms;

    // javascript will make 0.1 to 0.1000000000003638
    timeObject.ms = Math.round(timeObject.ms*1000);

    // format second to minute + second
    timeObject.minute = Math.floor(timeObject.second / 60 );
    timeObject.second = timeObject.second % 60;
    if (updateState && timeObject.minute>0 && durationInfo.minute === undefined) {
      durationInfo.minute = true;
    }

    // format minute to hour + minute
    timeObject.hour = Math.floor(timeObject.minute / 60 );
    timeObject.minute = timeObject.minute % 60;
    if (updateState && timeObject.hour>0 && durationInfo.hour === undefined) {
      durationInfo.hour = true;
    }
    return timeObject;
  }
  this.formatTime = formatTime;
  var leftpad = function(value,digital,prefix) {
    var string = value.toString();
    while (string.length < digital) {
      string = prefix.toString() + string;
    }
    return string;
  }

  // inits
  var initDOMs = function() {
    // find doms
    DOMs.container = document.getElementById(containerID);
    DOMs.video = DOMs.container.getElementsByTagName("video")[0];
    DOMs.speedInfo = DOMs.container.getElementsByClassName("speed-content")[0];
    DOMs.durationInfo = DOMs.container.getElementsByClassName("duration-content")[0];
    DOMs.positionInfo = DOMs.container.getElementsByClassName("position-content")[0];
    DOMs.loadingHint = DOMs.container.getElementsByClassName("loading-hint")[0];
    DOMs.seekbar = DOMs.container.getElementsByClassName("seekbar")[0];
    DOMs.pause = DOMs.container.getElementsByClassName("pause")[0];
    DOMs.play = DOMs.container.getElementsByClassName("play")[0];
    DOMs.stop = DOMs.container.getElementsByClassName("stop")[0];
    showPauseOrPlay(playButton);
  }
  var initDOMsValue = function() {
    DOMs.speedInfo.innerHTML = DOMs.video.playbackRate;
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
    DOMs.video.onerror = videoErrorAction;
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
  initDOMsValue();
  initPlayerEvents();
  initPlayer();
  initButtonEvent();

  loadVideo();
  playVideo(unattend);
}
