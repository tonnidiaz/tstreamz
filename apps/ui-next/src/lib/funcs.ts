import { headers } from "next/headers";
export const apiJson = Response.json;
export const tuErr = (msg: string = "Something went wrong", status = 500) =>
    Response.json({ message: `tu:${msg}` }, { status });
export const getHost = async () => {
    const headerList = await headers();
    const baseUrl =
        headerList.get("origin") || `http://${headerList.get("host")}`;
        console.log({baseUrl});
    return baseUrl;
};
