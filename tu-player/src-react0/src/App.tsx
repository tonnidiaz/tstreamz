import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import "@repo/ui/src/styles/all.scss"
import { app, server, filesystem as nfs } from "@neutralinojs/lib";
import { handleErrs } from "@repo/common/src/utils/funcs";
import { videoFolder } from "./lib/consts";
import {HashRouter as Router, Link, Routes, Route} from 'react-router-dom'

const videoFile = "The Simpsons S02E01 Bart Gets an F.mp4"
function App() {
   
    return (
        <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/about" element={<h2>About Page</h2>} />
      </Routes>

      <_App/>
    </Router>
       
    );
}


export default App;

const _App = () =>{
    const [count, setCount] = useState(0);

    useEffect(() => {
        init();
        return () => {
            // dispose();
        };
    }, []);

    const init = async () => {
        try {
           
            // const mounts = Object.values((await server.getMounts()) as any);
            // if (!mounts.includes("./videos")) {
            //     const r = await server.mount(videoFolder, NL_PATH + "/videos");
            // }
        } catch (err) {
            handleErrs(err);
        }
    };
    const dispose = async () => {
        try {
            await server.unmount(NL_PATH + "/videos");
        } catch (err) {
            handleErrs(err);
        }
    };
    const mountFolder = async () => {
        try {
            const url = "/videos/neu.txt"
            console.log({url});
            const f = await (await fetch(url)).text();
            console.log({ f });
        } catch (err) {
            console.log(err);
        }
    };

    const readFile = async () =>{
        try {
            const f = "/USB/Blind Waters (2023) 720p WEBDL - AVC - AAC - E-Sub - DUSIcTv.mkv"
            const f2 = videoFolder + "/" + videoFile
            console.log("\nReading file...");
            const t1 = Date.now()
            const r = await nfs.readBinaryFile(f)
            const delt = ((Date.now() - t1) / 60000).toFixed(2)
            console.log(`Done reading file in: ${delt} mins`);
        } catch (err) {
            console.log(err);
            
        }
    }
    return  <>
    <div>
        <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
            <img
                src={reactLogo}
                className="logo react"
                alt="React logo"
            />
        </a>
    </div>
    <h1>Vite + React</h1>
    <div className="card">
    <video style={{background: "black"}} src={`http://localhost:${45875}/files?path=${encodeURIComponent(`${videoFolder}/${videoFile}`)}`}  controls></video>
    </div>
    <p className="read-the-docs">
        Click on the Vite and React logos to learn more
    </p>
</>
}
