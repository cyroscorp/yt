import React, {useState, useRef} from 'react'

const Form = (props) => {

  const videoUrl = useRef()
  const [videoLink, setVideoLink] = useState({
  })

  const addVideo = () => {
    // console.log('setVideo', videoUrl.current.value)
    let url = new URL(videoUrl.current.value)
    const embedCode = url.searchParams.get('v')
    
    // console.log('embed', embedCode)
    props.addVideo({url: embedCode})
  }

  return (
    <div >
      <input ref={videoUrl} placeholder='enter youtube url' />
      <button onClick={addVideo}>Submit</button>
    </div>
  )
}

export default Form