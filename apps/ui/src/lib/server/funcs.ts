import { OTPBody, OTPSubject } from "@cmn/utils/bend/consts";
import { sendMail } from "@cmn/utils/bend/funcs";

export const sendSignupMail = async ({pin, email, SITE}:{pin: number; email: string, SITE: string}) =>{
    return await sendMail({clients: email, app: SITE, name: 'New user', body: OTPBody(pin, `<p>To finish creating your account use the OTP below:</p>`,), subject: OTPSubject(pin, SITE), heading: `Welcome to ${SITE}`})
}