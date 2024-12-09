import { SITE } from "@/lib/constants.js";
import { tuErr } from "@/lib/server/funcs.js";
import { User } from "@/lib/server/models/index.js";
import { genOTP, sendOTPMail } from "@cmn/utils/bend/funcs.js";
import { json } from "@sveltejs/kit";
export const POST = async ({ request, params }) => {
    const data = await request.json();
    const {endpoint} = params
    const { user: _user, value, newEmail } = data;
    if (!_user || (!value || !newEmail)) return tuErr(400, "Provide all required fields");
        const user = await User.findById(_user).exec();
        if (!user) return tuErr(400, "Specified user not found");
    if (params.endpoint == "verify") {
        

        const ok = value == user.otp;
        if (!ok) return tuErr(400, "OTP incorrect");
        if (newEmail){
            user.new_email_verified = true
            user.email = user.new_email
        }
        user.otp = undefined;
        await user.save();
        return json("Ok");
    }else if (endpoint == 'request'){
        if (newEmail){user.new_email = newEmail; user.new_email_verified = false}
        const pin = genOTP()
        await sendOTPMail({email: newEmail ||user.email, site: SITE, pin})
        user.otp = pin
        await user.save()
        return new Response("OTP sent to email")
    }
};
