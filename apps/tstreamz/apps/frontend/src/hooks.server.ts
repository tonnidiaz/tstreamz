import { dev } from "$app/environment";
import { connectMongo } from "@cmn/utils/bend/funcs";
import { clearTerminal } from "@cmn/utils/funcs";
import { config } from "dotenv";
import { SITE } from "./lib/constants";

import {
    type Handle,
    type HandleServerError,
    type RequestEvent,
} from "@sveltejs/kit";
import { handleErrs } from "@cmn/utils/funcs";
import { tuErr } from "@/lib/server/funcs";
import { User } from "@/lib/server/models";
import jwt from "jsonwebtoken";
import type { IObj } from "@cmn/utils/interfaces";

config();

async function main() {
    clearTerminal();
    console.log("Serverhook");
    await connectMongo(dev, SITE.toLowerCase());
}

main();

const protectedRoutes = ["auth/logi"];

async function authMed(event: RequestEvent, res: any, strict: boolean = true) {
    console.log({ strict });
    const req = event.request;
    const authorization = req.headers.get("Authorization");
    if (dev) console.log({ authorization });
    const tkn = authorization?.split(" ")[1];
    if (!tkn || tkn == "null") {
        console.log("Unauthorized");
        if (strict) return tuErr(401, "Unautorized. Token missing!");
    } else {
        try {
            const { payload } = jwt.verify(
                tkn,
                process.env.SECRET_KEY!
            ) as IObj;
            if (payload?.id) {
                const user = await User.findById(payload.id).exec();
                console.log({ user: user.username });
                event.locals.user = user;
            }
        } catch (e) {
            console.log("JWT ERR");
            handleErrs(e);
            if (strict) return tuErr(401, "Bad token");
        }
    }
    return res(event);
}
export const handle: Handle = async ({ resolve, event }) => {
    console.log("\nSERVER MIDDLEWARE\n");
 
        const req = event.request

    const { pathname, searchParams } = event.url;
    const { q, token } = Object.fromEntries(searchParams);
    const loginCond = pathname == "/api/auth/login" && q == "token";
    if (token){
        event.request.headers.set('Authorization', `Bearer ${token}`)
    }
    const strictCond =
        loginCond ||
        (req.method.toLowerCase() == "post" && req.url.includes("/user"));
    if (strictCond) {
        return authMed(event, resolve);
    } else {
        return authMed(event, resolve, false);
    }

    return resolve(event);
};

export const handleError: HandleServerError = async ({
    error,
    event,
    status,
    message,
}) => {
    handleErrs(error);
    return { message: "tu:Something went wrong", status };
};
