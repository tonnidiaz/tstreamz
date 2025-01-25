import jwt from "jsonwebtoken";
import { type IObj } from "../interfaces";
import nfs, { readFileSync } from "node:fs";
import nodemailer from "nodemailer";
import { GMAIL_HOST, GMAIL_PORT } from "../consts";
import path from "node:path";
import { config, configDotenv } from "dotenv";
import mongoose from "mongoose";
import { handleErrs, randomInRange } from "../funcs";
import { DEV } from "./consts";
import bcrypt from "bcryptjs"

configDotenv();
export const genToken = (data: IObj, exp?: string | number | undefined) => {
    const { SECRET_KEY } = process.env;
    if (DEV) console.log({ SECRET_KEY });
    const _jwt: typeof jwt = (jwt as any).default;
    const __jwt = _jwt || jwt;
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
import nodeUrl from "node:url";
const __filename = nodeUrl.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _dirname = __dirname
export const sendMail = async ({
    subject,
    app,
    body,
    clients,
    sender,
    overrideBody,
    name,
    heading,
}: {
    subject: string;
    app: string;
    body: string;
    clients: string | string[];
    sender?: string;
    overrideBody?: boolean;
    name: string;
    heading?: string;
}) => {
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
// console.log({_dirname});
        let html = overrideBody
            ? body
            : readFileSync(path.join(_dirname, "../../static/mj-email-skeleton.html"), {
                  encoding: "utf-8",
              });
        if (!overrideBody) {
            // Replace {site, heading, name, body, email}
            const temp =(name: string) => `{%${name}%}`
            html = html
                .replaceAll(temp("site"), app)
                .replaceAll(temp("name"), name)
                .replaceAll(temp("heading"), heading || "")
                .replaceAll(temp("email"), _sender)
                .replaceAll(temp("body"), body);
        }
        

            // return writeFileSync(path.join(_dirname, "../../static/out/mail.html"), html);
        let info = await transporter.sendMail({
            from: `"${app}" <${_sender}>`, // sender address
            to: `"${clients}"`, // list of receivers
            subject, // Subject line
            html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        return "Email sent";
    } catch (err) {
        handleErrs(err);
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
    ensureDirExists(fp);
    nfs.writeFileSync(fp, JSON.stringify(data));
    console.log(fp);
    console.log("SAVED!!\n");
};

export const existsSync = (fp: string) => nfs.existsSync(fp);
export const readJson = (fp: string) => {
    if (!existsSync(fp)) return console.log(fp, "Does not exist");
    const data = nfs.readFileSync(fp, { encoding: "utf-8" });
    return JSON.parse(data);
};

export async function connectMongo(DEV: boolean, db: string = "tb") {
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
export function createMongoConn(DEV: boolean, db: string = "tb") {
config()
    console.log("Creating mongo connection...", { DEV, db });
    let mongoURL = (DEV ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL)!;
    try {
        console.log({mongoURL});
        return mongoose.createConnection(mongoURL, {dbName: db})
    } catch (e) {
        console.log("Could not establish connection");
        handleErrs(e);
    }
}

export const hashPass = async (pwd: string) => bcrypt.hashSync(pwd, 10);

export const genOTP = () => {
    const pin = randomInRange(1000, 9999);
    console.log({ pin });
    return pin;
};
export const sendOTPMail = async ({
    email,
    site,
    name,
    heading,
    pin,
}: {
    email: string;
    site: string;
    name: string;
    heading?: string;
    pin: number;
}) => {
    await sendMail({
        subject: site + " Verification Email",
        app: site,
        body: `<h2 style="font-weight: 500; font-size: 1.2rem;">Here is your verification OTP:</h2>
                <p style="font-size: 20px; font-weight: 600">${pin}</p>
            `,
        clients: email,
        name,
        heading,
    });
};
