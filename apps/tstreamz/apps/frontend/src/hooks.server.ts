import { dev } from "$app/environment"
import { connectMongo } from "@cmn/utils/bend/funcs"
import { clearTerminal } from "@cmn/utils/funcs"
import {config} from "dotenv"
import { SITE } from "./lib/constants"

import { type Handle, type RequestEvent } from "@sveltejs/kit";
import { handleErrs } from "@cmn/utils/funcs";
import { tuErr } from "@/lib/server/funcs";
import { User } from "@/lib/server/models";
import jwt from "jsonwebtoken"
import type { IObj } from "@cmn/utils/interfaces";

config()

async function main(){
    clearTerminal()
    console.log("Serverhook")
    await connectMongo(dev, SITE.toLowerCase())
}

main()

const protectedRoutes = ["auth/logi"];

async function authMed(event: RequestEvent, res: any) {
    const req = event.request
    const authorization = req.headers.get("Authorization");
    if (dev) console.log({authorization})
    const tkn = authorization?.split(" ")[1];
    if (!tkn || tkn == "null") {
        console.log("Unauthorized");
        return tuErr(401, "Unautorized. Token missing!");
    } else {
        try {
            const { payload } = jwt.verify(
                tkn,
                process.env.SECRET_KEY! 
            ) as IObj;
            if (payload?.id) {
                const user = await User.findById(payload.id).exec();
                console.log({user: user.username});
                event.locals.user = user
            }
        } catch (e) {
            console.log("JWT ERR");
            handleErrs(e)
            return tuErr(401, "Bad token");
        }
    }
    return res(event)
}
export const handle: Handle = async ({ resolve, event }) => {
    console.log("\nSERVER MIDDLEWARE\n");
    const req = event.request;

    const { pathname, searchParams } = event.url;
    const q = searchParams.get("q");
    const loginCond = pathname == "/api/auth/login" && q == "token"
    if (loginCond || (req.method.toLowerCase() == "post" && req.url.includes("/user") )) {
        return authMed(event, resolve);
    }

    return resolve(event);
};