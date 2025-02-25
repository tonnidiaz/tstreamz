import {useEffect, useRef, useState} from 'react';
// import {Greet, GetPort} from "../wailsjs/go/main/App";
import { useTuState } from '@repo/ui-next/src/lib/hooks';
import "./App.css"
import "@flaticon/flaticon-uicons/css/all/all.css"
import videojs from 'video.js';
import { VideoJS } from './components/VideoJs';
export const videoFolder =
    "/home/tonni/Downloads/The Simpsons S01-S30 (1989-) + Shorts (1987-1989) + Movie (2007)/The Simpsons S02 (360p re-dvdrip)";
    const videoFile = "The Simpsons S02E01 Bart Gets an F.mp4"
    const filename =  "/USB/Ghosted (2023) (NetNaija.com).mkv"
function App() {
    const port = useTuState(45874)
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);
    const src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"// "http://localhost:45875/files?path=%2FUSB%2FPurple_Hearts_(2022)_(NetNaija.com)_(1).mp4"//`http://localhost:${45875}/files?path=${encodeURIComponent(filename)}`
    const playerRef = useRef<any>()
    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src,
          type: 'video/mp4'
        }]
      };
    
      const handlePlayerReady = (player) => {
        playerRef.current = player;
    
        // You can handle player events here, for example:
        player.on('waiting', () => {
          videojs.log('player is waiting');
        });
    
        player.on('dispose', () => {
          videojs.log('player will dispose');
        });
      };
    
    useEffect(()=>{
        init()
    },[])
    function greet() {
        // Greet(name).then(updateResultText);
    }

    async function init(){
        try {   
            // // Get the go custom server port
        //    const _port = await GetPort()
            // port.value = _port
        } catch (err) {
            console.log(err);
        }
    }

    
    

    return !port.value ? null : (
        <div id="App">
            <h3><b>PORT: </b>{port.value}</h3>
            <div id="input" className="input-box">   
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn btn-primary w-full h-full my-4 h-100px" onClick={greet}>Greet</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 5}} className="flex flex-col">
               <video disablePictureInPicture style={{background: "black", width: 400, height: 200}} controls>
                <source  src={src} />
            </video>
            {/* <video src={vid} controls></video> */} 
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </div>
            
        </div>
    )
}

export default App
