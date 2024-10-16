import React, {useState} from "react";
import YouTube from 'react-youtube';
import "./styles.css";
import VideoList from './Components/VideoList.js'
import Form from './Components/Form.js'


export default function App() {

  const [videoList, setVideoList] = useState([])

  const addVideo = (video) => {
    setVideoList([video, ...videoList])

    console.log('setState video', video)
  }

  return (
    <div className="App">
      <Form addVideo={addVideo}/>
      <VideoList videoList={videoList}/>
    </div>
  );
}
