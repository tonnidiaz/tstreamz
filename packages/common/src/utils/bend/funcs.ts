import jwt from "jsonwebtoken"
import { IObj } from "../interfaces";
import nfs from "node:fs"
import nodemailer from "nodemailer"
import { developer, GMAIL_HOST, GMAIL_PORT } from "../consts";
import path from "node:path";
import {configDotenv} from "dotenv"
import mongoose from "mongoose";
import { handleErrs } from "../funcs";
import { DEV } from "./consts";

configDotenv();
export const genToken = (data: IObj, exp?: string | number | undefined) => {
    const { SECRET_KEY } = process.env;
    if (DEV) console.log({SECRET_KEY})
    const _jwt: typeof jwt = (jwt as any).default
    const __jwt = _jwt || jwt
    return exp
        ? __jwt.sign(
              {
                  data,
              },
              SECRET_KEY!,
              { expiresIn: exp }
          )
        : __jwt.sign({ payload: data }, SECRET_KEY!);
};

export const sendMail = async ({subject, app, body, clients, sender}:
    {subject: string,
        app: string;
    body: string,
    clients: string | string[],
    sender?: string}
) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: GMAIL_HOST, //"smtp.ethereal.email",
            port: Number(GMAIL_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.ADMIN_GMAIL_EMAIL, //testAccount.user, // generated ethereal user
                pass: process.env.ADMIN_GMAIL_PASSWORD, //testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        const _sender = sender || process.env.ADMIN_GMAIL_EMAIL;
        console.log("SENDING FROM: ", _sender);
        console.log("SENDING MAIL TO: ", clients);
        let info = await transporter.sendMail({
            from: `"${app}" <${_sender}>`, // sender address
            to: `"${clients}"`, // list of receivers
            subject, // Subject line
            html: `<html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style type="text/css">
              .tb {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif  !important;
                margin: auto;
                padding: 10px;
                color: black;
              }
        
              .btn {
                cursor: pointer;
                display: inline-block;
                min-height: 1em;
                outline: 0;
                border: none;
                vertical-align: baseline;
                background: #e0e1e2 none;
                color: rgba(0, 0, 0, 0.6);
                font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
                margin: 0 0.25em 0 0;
                padding: 10px 16px;
                text-transform: none;
                text-shadow: none;
                font-weight: 600;
                line-height: 1em;
                font-style: normal;
                text-align: center;
                text-decoration: none;
                border-radius: 0.28571429rem;
                box-shadow: inset 0 0 0 1px transparent,
                  inset 0 0 0 0 rgba(34, 36, 38, 0.15);
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
                transition: opacity 0.1s ease, background-color 0.1s ease,
                  color 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
                will-change: "";
                -webkit-tap-highlight-color: transparent;
              }
              .btn-primary {
                color: #fff !important;
                background-color: #0d6efd !important;
                border-color: #0d6efd !important;
              }
              .btn-danger {
                color: #fff !important;
                background-color: #fd950d !important;
                border-color: #fd950d !important;
              }
        a{
          color: #f08800 !important;
          font-weight: 600 !important;
        }
              table {
               
               
                width: 100%;
                
                border-radius: 10px !important;
                padding: 5px;
                border-collapse: collapse;
              }
        
              td,
              th {
                border: 2px solid #8f8f8f;
                text-align: left;
                padding: 8px;
              }
        
              tr:nth-child(even) {
                background-color: #e6e6e6;
              }
        
              .otp {
                /*background-color: #c4c4c4;
                border: 2px dashed #d37305;
                padding: 10px;
                border-radius: 5px;
                width: 150px;
                text-align: center;
                font-weight: 700;
                letter-spacing: 6;
                font-family: monospace;
                font-size: 20px;*/
              }
              .text-c{
                text-align: center !important;
              }

              .m-auto{
                margin: 0 auto;
              }
            </style>
          </head>
          <body>
  
              <div class="tb">
              <h2>${app} app</h2>
              ${body}
              <p>For support please contact the Developer at <a href="mailto:${developer.email}">${developer.email}</a></p>
              </div>
  
          </body>
          </html>
                `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        return "Email sent";
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const ensureDirExists = (filePath: string) => {
    var dirname = path.dirname(filePath);
    if (nfs.existsSync(dirname)) {
        return true;
    }
    ensureDirExists(dirname);
    console.log("Creating directory");
    nfs.mkdirSync(dirname);
};

export const writeJson = (fp: string, data: any) => {
    console.log("\nSaving....");
    ensureDirExists(fp)
    nfs.writeFileSync(fp, JSON.stringify(data));
    console.log(fp)
    console.log("SAVED!!\n");
};

export const existsSync = (fp: string) => nfs.existsSync(fp);
export const readJson = (fp: string) => {
    const data = nfs.readFileSync(fp, { encoding: "utf-8" });
    return JSON.parse(data);
};
 


export async function connectMongo(DEV: boolean, db:string = "tb") {
    console.log("Connecting mongo...", { DEV, db });
    let mongoURL = (DEV ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL)!;
    try {
        console.log(mongoURL);
        await mongoose.connect(mongoURL, { dbName: db });
        console.log("\nConnection established\n");
    } catch (e) {
        console.log("Could not establish connection");
        handleErrs(e);
    }
}