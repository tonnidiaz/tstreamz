
import type { IObj } from "@cmn/utils/interfaces";
import { error, type Handle, type HandleServerError, type RequestEvent } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { handleErrs } from "@cmn/utils/funcs";
import { connectMongo } from "@cmn/utils/bend/funcs";
import {handleError} from '@repo/ui-sv/hooks.server'
import { __DEV__ } from "./lib/constants";
import { captureLogs } from "@pkg/common/utils/functions2";
import { User } from "@pkg/common/models";

// clearTerminal()
const fn = async () => {

    console.log("Run once!!"); 
    if (!__DEV__)
    captureLogs({appName: "tu-trader"})
    await connectMongo(__DEV__, __DEV__ ? "tb" : "tu-trader");
};
fn();

const protectedRoutes = ["auth/logi"];

async function authMed(event: RequestEvent, res: any) {
    const req = event.request
    const authorization = req.headers.get("authorization");
    const tkn = authorization?.split(" ")[1];
    if (!tkn || tkn == "null") {
        console.log("Unauthorized");
        return error(401, "Unautorized. Token missing!");
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
            console.log("JWT ERR:", e);
            return error(401, "Bad token");
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

export {handleError}