"use server";

import { UserModel } from "@/models";
import { DEV } from "@cmn/utils/bend/consts";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";
import { genPost } from "./funcs2";
import axios from "axios";


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


export const getUsers = async () => {
    try {
        const users = await UserModel.find({}).exec();
        return users.map((el) => el.toJSON());
    } catch (err) {
        handleErrs(err);
    }
};

export const getPostById = async (id: string) =>{
    const ts = Date.now()
    timedLog("KUNJALO", ts)
    const post = await genPost(id)
    return post
}

import * as cheerio from "cheerio"

export async function parseMeta(url: string) {
    try {
        const {data: html} = await axios.get(url)
        const $ = cheerio.load(html)
        const title = $("title").text()
        return {title}
    } catch (err) {
        handleErrs(err)
        
    }
}