import { SITE } from "@/lib/constants.js";
import { tuErr } from "@/lib/server/funcs.js";
import { User } from "@/lib/server/models/index.js";
import { defOTPMessage, OTPBody, OTPSubject } from "@cmn/utils/bend/consts";
import { genOTP, sendMail, sendOTPMail, verifyPwd } from "@cmn/utils/bend/funcs";
import { json } from "@sveltejs/kit";
export const POST = async ({ request }) => {
    const data = await request.json();
    const { user: _user, value, sendPin } = data;
    if (!_user || !value) return tuErr(400, "Provide all required fields");
    const user = await User.findById(_user).exec();
    if (!user) return tuErr(400, "Specified user not found");

    const ok = await verifyPwd(value, user.password);
    if (!ok) return tuErr(400, "Password incorrect");
    if (sendPin) {
        const pin = genOTP();
        console.log({ pin });
        user.otp = pin;
        // await sendOTPMail({ email: user.email, site: SITE, pin });
        await sendMail({
            clients: user.email,
            app: SITE,
            name: user.first_name || user.username,
            body: OTPBody(
                pin,
                defOTPMessage
            ),
            subject: OTPSubject(pin, SITE),
        });
        await user.save();
    }
    return json("Ok");
};
