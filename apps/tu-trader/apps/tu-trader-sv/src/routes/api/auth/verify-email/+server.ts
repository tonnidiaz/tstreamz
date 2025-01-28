import { tuErr } from "@/lib/server/funcs";
import { genToken } from "@cmn/utils/bend/funcs";
import { User } from "@pkg/cmn/models";
import { json } from "@sveltejs/kit";

export const POST = async ({ request: req }) => {
    const { email, otp } = await req.json();
    if (!email || !otp) return tuErr(400, 'Please provide all required fields')
    const user = await User.findOne({ email }).exec();
    if (!user) return tuErr(400, "Restart the signup process");

    if (user.otp == Number(otp)) {
        user.email_verified = true;
    } else {
        return tuErr(400, "Incorrect OTP");
    }

    await user.save();
    return json({ user: user.toJSON(), token: genToken({ id: user.id }) });
};
