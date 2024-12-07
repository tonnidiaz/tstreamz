import { dev } from "$app/environment";
import { SITE } from "@/lib/constants";
import { tuErr } from "@/lib/server/funcs";
import { User } from "@/lib/server/models/index.js";
import { genToken, sendMail } from "@cmn/utils/bend/funcs";
import { handleErrs, randomInRange } from "@cmn/utils/funcs";
import { json } from "@sveltejs/kit";
import bcrypt from "bcrypt"

export const POST = async ({url, request: req}) => {
    try {
        const body = await req.json()
        const query = Object.fromEntries(url.searchParams)

        if (query.act == "complete") {
            const user = await User.findOne({ email: body.email }).exec();
            for (let k of Object.keys(body)) {
                if (k != "password") {
                    user!.set(k, body[k]);
                }
            }
            await user!.save();
            const token = genToken({ id: user!._id });
            return json({ token });
        }

        // Delete existing user with unverified email
        await User.findOneAndDelete({
            email: body.email,
            email_verified: false,
        }).exec();
        // Delete existing user with unverified username
        await User.findOneAndDelete({
            username: body.username,
            email_verified: false,
        }).exec();

        if (
            await User.findOne({
                email: body.email,
                email_verified: true,
            }).exec()
        )
            return tuErr(
                400,
                "User already with same email already exists"
            );

        if (
            await User.findOne({
                username: body.username,
                email_verified: true,
            }).exec()
        )
            return tuErr(
                400,
                "User already with same username already exists"
            );

        const user = new User();
        for (let key of Object.keys(body)) {
            if (key == "password") {
                user.password = bcrypt.hashSync(body.password, 10);
            } else {
                user[key] = body[key];
            }
        }
        const otp = randomInRange(1000, 9999);
        if (dev) {
            console.log(otp);
        }
        user.otp = otp;

        await sendMail(
            {subject: SITE + " Verification Email", app: SITE,
            body: `<h2 style="font-weight: 500; font-size: 1.2rem;">Here is your signup verification OTP:</h2>
                    <p style="font-size: 20px; font-weight: 600">${user.otp}</p>
                `,
            clients: user.email}
        );

        await user.save();
        return json({ msg: "OTP Generated" });
    } catch (e) {
        handleErrs(e);
        return tuErr(500, "Something went wrong");
    }
}