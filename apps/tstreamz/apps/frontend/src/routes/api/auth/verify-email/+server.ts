import { tuErr } from "@/lib/server/funcs";
import { User } from "@/lib/server/models";
import { genToken } from "@cmn/utils/bend/funcs";
import { randomInRange, handleErrs } from "@cmn/utils/funcs";
import { json } from "@sveltejs/kit";

export const POST = async ({request: req}) => {
    const { email, otp } = await req.json();

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return tuErr( 400, "Restart the signup process");

        if (!otp) {
            const pin = randomInRange(1000, 9999);
            //TODO: Send real pin
            console.log(pin);
            user.otp = pin;
        } else {
            if (user.otp == otp) {
                user.email_verified = true;
                
            } else {
                return tuErr(400, "Incorrect OTP");
            }
        }
        await user.save();
        return json({ user: user.toJSON(), token: genToken({ id: user.id }) });
    } catch (e) {
        handleErrs(e);
        tuErr(500, "Something went wrong");
    }
}