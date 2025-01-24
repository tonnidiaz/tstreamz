import { config } from "dotenv";

config()
export const DEV = process.env.ENV == "dev";
export const OTPBody = (pin: number, msg = "Here is your OTP") => {
    return `<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">${msg}</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:25px;font-weight:600;letter-spacing:2px;line-height:1;text-align:left;color:#000000;">
                            <div style="background-color: rgba(76,222, 128, .4); width: 150px; padding: 5px;font-family: monospace" class="font-monospace fs-24 fw-6 m-auto">${pin}</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>`;
};


export const defOTPMessage = `<p>Use the OTP below to complete action:</p>`
export const OTPSubject = (pin: number, site: string) => `${pin} is your ${site} verification code`