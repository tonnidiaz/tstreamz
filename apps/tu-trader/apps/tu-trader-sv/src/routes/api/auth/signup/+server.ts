import { SITE } from "@/lib/constants";
import { tuErr } from "@/lib/server/funcs";
import { genToken, hashPass, genOTP } from "@cmn/utils/bend/funcs";
import { User } from "@pkg/cmn/models";
import { sendSignupMail } from "@repo/ui-sv/lib/server/funcs";
import { json } from "@sveltejs/kit";

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
                user.password = await hashPass(body.password);
            } else {
                user[key] = body[key];
            }
        }
        const otp = genOTP();
        if (true) {
            console.log(otp);
        }
        user.otp = otp;

        await sendSignupMail({email: user.email, pin: user.otp, SITE})

        await user.save();
        return json({ msg: "OTP Generated" });
    
}