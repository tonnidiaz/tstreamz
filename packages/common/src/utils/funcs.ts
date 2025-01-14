import { isAxiosError } from "axios";

export function randomInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const isEmail = (emailAdress: string) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailAdress.match(regex) ? true : false;
};

const ddNum = (e: any) => {
    e = `${e}`.trim();
    return e.length == 1 ? `0${e}` : e;
};
const toISOString = (date: string) => {
    let dateArr = date.split(",");
    let time = dateArr[1];
    time = time
        .split(":")
        .map((el) => ddNum(el))
        .join(":");
    dateArr = dateArr[0].split("/");
    date = `${dateArr[0]}-${ddNum(dateArr[1])}-${ddNum(dateArr[2])}`;
    return `${date} ${time}+02:00`;
};
export const parseDate = (date?: Date | string | number) =>
    toISOString(
        new Date(date || Date.now()).toLocaleString("en-ZA", {
            timeZone: "Africa/Johannesburg",
        })
    );

export const timedLog = (...args: any[]) =>
    console.log(`\n[${parseDate(new Date())}]`, ...args);
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toFixed(num: number, dec: number) {
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (dec || -1) + "})?");
    const isLarge = `${num}`.includes("e");
    return isLarge || dec == 0 ? num : Number(num.toString().match(re)![0]);
}
export function ceil(num: number, dec: number) {
    const isLarge = `${num}`.includes("e");
    return isLarge || dec == 0 ? num : Number(num.toFixed(dec));
}

/**
 *
 * @param num1 must be less than num2
 * @returns the percentage difference between the two numbers
 */
export const calcPerc = (num1: number, num2: number) =>
    ceil(((num2 - num1) / num1) * 100, 2);

export const sleep = async (ms: number) => {
    await new Promise((res) => setTimeout(res, ms));
};

export const clearTerminal = () => {
    process.stdout.write("\x1Bc");
};

export const handleErrs = (err: any) => {
    // console.log(err)
    let _err: any;
    if (isAxiosError(err)){
        _err = {
              code: err.response?.status ?? err.status ?? err.code ?? err.name,
              msg: err.response?.data ?? err.message,
          }
    }else if (err instanceof TypeError ){
        _err = {...err}
    }else{
        _err  = err?.body?.message ??
        err?.message?.toString() ??
        err?.message ??
        err
    }

    _err = Object.keys(_err).length ? _err : err

    console.error("TuERR:",_err)
    return _err

};

export const isTuError = (er: any): string | undefined =>{
    const msg = er?.response?.data?.message
    return msg?.startsWith?.('tu:') ? msg.replace('tu:', '') : undefined
}