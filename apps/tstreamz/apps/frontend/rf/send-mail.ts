import { OTPBody } from "@cmn/utils/bend/consts";
import { sendMail } from "@cmn/utils/bend/funcs";
import { readFileSync } from "fs";

// let mailHtml = readFileSync('static/mj-email.html', {encoding: 'utf-8'})

async function main() {
    console.log('Sending mail');
    await sendMail({subject: `Verification pin ${Date.now()} - Tunedstreamz`, body: OTPBody(4587, "<p>We're sorry to see you leave.</p><p>Use the OTP below to proceed account deletion:</p>"), app: 'Tunedstreamz', clients: 'squashdavenport2@gmail.com', overrideBody: false, name: 'Tonni Diaz', heading: 'Delete account'})
    console.log('Done');
}

main()