"use server";

import { JobModel, UserModel } from "@/models";
import { DEV } from "@cmn/utils/bend/consts";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { jwtVerify, SignJWT } from "jose";
import { TJobSource } from "../interfaces";
import { baseUrls } from "../consts";
import { genApplyLink } from "../funcs";
import { scrapeJobDetails } from "./scraper";

export const runOnce = async () => {
    const { configDotenv } = await import("dotenv");
    const { connectMongo } = await import("@cmn/utils/bend/funcs");
    configDotenv();
    // if (appStarted) return
    clearTerminal();
    timedLog("[RUN ONCE]\n");
    try {
        // Connect to db
        await connectMongo(DEV, "tu-jobs");
    } catch (err) {
        handleErrs(err);
    } finally {
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

// export const getCareerJunctionJob = async () =>{
//     const {data: html} =
// }
export const getJobById = async (id: string) => {
    try {
        const pre = id.split("-")[0]?.replace("TUJID_", "");
        let source: TJobSource = "career24";
        let link: string | undefined;
        if (pre) {
            switch (pre.toLowerCase()) {
                case "cj":
                    source = "careerjunction";
                    const _id = id.split("-").pop();
                    link = genApplyLink(_id, source);
                    break;
            }
        }
        if (link){console.log({link})}
        const job = link
            ? await scrapeJobDetails(link, source)
            : await JobModel.findById(id).exec();
        if (!job) return console.log("JOB IS NULL")
        return {
            title: job.title,
            source,
            id,
            jobId: job.jobId,
            link: job.link,
            posted: job.posted,
            exp: job.exp,
            meta: (job as any).meta as string | undefined,
            descHtml: (job as any).descHtml as string[] | undefined,
        };
    } catch (err) {
        handleErrs(err);
    }
};

export type TJobData = Awaited<ReturnType<typeof getJobById>>;

export const getCookies = async (name?: string) =>
    (await cookies()).getAll(name);
export const setCookies = async (
    ...params:
        | [key: string, value: string, cookie?: Partial<ResponseCookie>]
        | [options: ResponseCookie]
) => {
    (await cookies()).set(...params);
};

const getJWTSecret = (secret: string) => {
    const _secret = new TextEncoder().encode(secret);
    return _secret;
};

export const verifyJWT = async (tkn: string, secret: string) => {
    if (!tkn || !secret)
        return console.log("[JWT] PLEASE PROVIDE TOKEN AND SECRET");
    return (await jwtVerify(tkn, getJWTSecret(secret))).payload;
};

export const signJWT = async (data: any, secret: string) =>
    await new SignJWT(data)
        .setProtectedHeader({ alg: "HS256" })
        .sign(getJWTSecret(secret));
