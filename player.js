var createPlayer  = function() {
  throw("this function not working");

  var video = document.createElement("video");
  document.body.appendChild(video);
}

var player = function(containerID,file,config) {
  // for internal access
  var DOMs = {
    container: {},
    videos: {},
    playSpeedInfo: {},
    loadingHint: {}
  }

  // public access function
  this.DOMs = DOMs; // debug using

  this.setSpeed = function(speed) {
    videoDOM.playbackRate = speed;
    DOMs.playSpeedInfo.innerHTML = videoDOM.playbackRate;
  }

  var loadingHintDisplay = function(showOrNot) {
    if (showOrNot) {
      DOMs.loadingHint.style.display="";
    } else {
      DOMs.logdingHint.style.display="none";
    }
  }

  // inits
  var initDOMs = function() {
    // find doms
    DOMs.container = document.getElementById(containerID);
    DOMs.videos = DOMs.container.getElementsByTagName("video");
    DOMs.playSpeedInfo = DOMs.container.getElementsByClassName("play-speed-info")[0];
    DOMs.loadingHint = DOMs.container.getElementsByClassName("loading-hint")[0];
  }
  var initVideoDOMs = function(initThings) {
    for (index = 0; index < DOMs.videos.length; index++) {
      initThings(DOMs.videos[index]);
    }
  }
  var initPlayer = function() {
    // setup player
    initVideoDOMs(function(video) {
      video.controls = config.defaultControls;
      video.style.width = config.playerWidth;
      video.style.height = config.playerHeight;
    });

    // setup player file
    DOMs.videos[0].src = file;
  }
  var initPlayerEvents = function() {
    initVideoDOMs(function(video) {
      // add buffer event
      video.onwaiting = function() {
        loadingHintDisplay(true);
        var loadingInterval = setInterval(function() {
          var state = video.readyState;
          if (state == 4) {
            loadingHintDisplay(false);
            clearInterval(loadingInterval);
          }
        },100);
      };
      
      // add xxxxxxx event
    });
  }

  // constractor here
  initDOMs();
  initPlayer();
  initPlayerEvents();

}
