"use server";

import { DEV } from "@cmn/utils/bend/consts";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";
import axios from "axios";
import { parseMetadata } from "../funcs";


export const runOnce = async () => {
    const { configDotenv } = await import("dotenv");
    const { connectMongo } = await import("@cmn/utils/bend/funcs");
    configDotenv()
    // if (appStarted) return
    clearTerminal();
    timedLog("[RUN ONCE]\n");
    try {
        // Connect to db
        await connectMongo(DEV, "tu-next");
    } catch (err) {
        handleErrs(err);
    }finally{
        // appStarted = true
    }
};



export async function parseMeta(url: string) {
    try {
        const {data: html} = await axios.get(url)
        return await parseMetadata(url, html)
    } catch (err) {
        handleErrs(err)
        
    }
}