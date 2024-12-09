import { handleErrs } from "@cmn/utils/funcs";
import type { IObj } from "@cmn/utils/interfaces";
import { tuErr } from "./funcs";
import { User } from "./models";
import { json } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import { hashPass } from "@cmn/utils/bend/funcs";
import { dev } from "$app/environment";

export async function updateUser(id: string, body: IObj, f: string) {
    const user = await User.findById(id).exec();
    if (!user) return tuErr(400, "User does not exist");
    const existingUsername = await User.findOne({
            username: body.username,
        }).exec(),
        existingEmail = await User.findOne({ email: body.email }).exec();

    // Validate password first if email | username
    const isUpdatingEmail = body.email && body.email != user.email,
        isUpdatingUsername = body.username && body.username != user.username;

 
    if (f == "info") {
        if (existingEmail && existingEmail.id != user.id)
            return tuErr(400, "Email address already exists");
        if (existingUsername && existingUsername.id != user.id)
            return tuErr(400, "Username address already exists");

        for (let k of Object.keys(body)) {
            const v = body[k];
            if (k == "newPwd") {
                if (dev) console.log('Changing pwd to:', v);
                user.set("password", hashPass(v));
            } else user.set(k, v);
        }
    }

    await user.save();
    return json(user.toJSON());
}
export async function delUser(id: string) {
    const user = await User.findByIdAndDelete(id).exec();
    if (!user) return tuErr(400, "User does not exist");

    return json({ message: "User account deleted" });
}
