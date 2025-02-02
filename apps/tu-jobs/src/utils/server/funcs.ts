"use server";

import { UserModel } from "@/models";
import { DEV } from "@cmn/utils/bend/consts";
import { clearTerminal, handleErrs, timedLog } from "@cmn/utils/funcs";


export const runOnce = async () => {
    const { configDotenv } = await import("dotenv");
    const { connectMongo } = await import("@cmn/utils/bend/funcs");
    configDotenv()
    // if (appStarted) return
    // clearTerminal();
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
