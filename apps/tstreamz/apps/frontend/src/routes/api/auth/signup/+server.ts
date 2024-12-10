import { dev } from "$app/environment";
import { SITE } from "@/lib/constants";
import { tuErr } from "@/lib/server/funcs";
import { sendSignupMail } from "@/lib/server/funcs2.js";
import { User } from "@/lib/server/models/index.js";
import { OTPBody } from "@cmn/utils/bend/consts.js";
import { genToken, hashPass, genOTP, sendOTPMail, sendMail } from "@cmn/utils/bend/funcs";
import { handleErrs, randomInRange } from "@cmn/utils/funcs";
import { json } from "@sveltejs/kit";
import bcrypt from "bcrypt"

export const POST = async ({url, request: req}) => {
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
                "User with same email already exists"
            );

        if (
            await User.findOne({
                username: body.username,
                email_verified: true,
            }).exec()
        )
            return tuErr(
                400,
                "User with same username already exists"
            );

        const user = new User();
        for (let key of Object.keys(body)) {
            if (key == "password") {
                user.password = hashPass(body.password);
            } else {
                user[key] = body[key];
            }
        }
        const otp = genOTP();
        if (true) {
            console.log(otp);
        }
        user.otp = otp;

        await sendSignupMail({email: user.email, pin: user.otp})

        await user.save();
        return json({ msg: "OTP Generated" });
    
}