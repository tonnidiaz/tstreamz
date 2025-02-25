"use client"
import { STORAGE_KEYS } from "@repo/ui/utils/consts";
import Image from "next/image";
import {invoke} from '@tauri-apps/api/tauri'
import UButton from '@repo/ui-next/components/UButton'
import { useState } from "react";

const videoPath = "file:///home/tonni/Downloads/The Simpsons S01-S30 (1989-) + Shorts (1987-1989) + Movie (2007)/The Simpsons S02 (360p re-dvdrip)/The Simpsons S02E03 Treehouse of Horror.mp4"
export default function Home() {
    const [src, setSrc] = useState("")
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Hello Next Tauri</h1>
        <p>{STORAGE_KEYS.authTkn}</p>
        <video src={src} controls></video>
         <UButton onClick={async(e)=>{
            try{
                const r = videoPath//await invoke("get_video_path")
                console.log(r)
                setSrc(`/api/file/${encodeURIComponent(r)}`)
            }catch(e){
                console.log(e)
            }
        }} className="btn-primary">Get video path</UButton>
      </main>
    </div> 
  );
}
