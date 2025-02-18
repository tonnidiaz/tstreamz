import Page from "./p";
import { getHost } from "@repo/ui-next/lib/funcs";

const page = async () => {
    const host = await getHost();
    return <Page origin={host} />;
};

export default page;
