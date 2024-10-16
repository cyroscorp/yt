import React from "react";
import YouTube from "react-youtube";

const VideoList = (props) => {
  console.log("video props", props);

  const playNextVideo = (e, videoId) => {
    console.log("video id -", videoId);
    let nextVideo = videos[videoId];
    console.log("next video - ", nextVideo);
    if (props.videoList.length > 1) {
      console.log("player state", nextVideo.type.PlayerState);
      console.log("event", e);
      nextVideo.props.opts.playerVars.autoplay = 1;
      console.log("playerVars", nextVideo.props.opts.playerVars);
      console.log("next video - ", nextVideo);
    }
  };
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };
  let videos = props.videoList.map((video, i) => {
    return (
      <YouTube
        videoId={video.url}
        id={i}
        opts={opts}
        onEnd={(e) => playNextVideo(e, i + 1)}
      />
    );
  });

  //OLD SRC CODE
  // let videoSrc =` https://www.youtube.com/embed/${props.src}`

  // OLD API CODE
  // const tag = document.createElement('script');
  // tag.src = "https://www.youtube.com/iframe_api";
  // const firstScriptTag = document.getElementsByTagName('script')[0];
  // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // OLD API CODE

  // let player = null;
  // function onYouTubeIframeAPIReady() {
  //   player = new YT.Player('player', {
  //     height: '390',
  //     width: '640',
  //     videoId: {videoId: video.url},
  //     events: {
  //       'onReady': onPlayerReady,
  //       'onStateChange': onPlayerStateChange
  //     }
  //   });
  // }

  //

  // function onPlayerStateChange(event) {
  //   if (event.data == YT.PlayerState.ENDED) {
  //
  //   }
  // }

  return (
    <div className="videoList">
      <h2>Videos!!</h2>
      {videos}
    </div>
  );
};

export default VideoList;
