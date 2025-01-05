import { DepInfo, User } from "@pkg/cmn/models";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ request, params, locals }) => {
    const body = await request.json();
    const { act } = params;
    const user = locals.user!;
    // console.log({body});
    if (act == "add") {
        console.log("Adding new deposit address...");
        const addr = new DepInfo({ ...body });
        // console.log(user);
        addr.user = user.id ?? (await User.findById(user._id).exec()).id;
        await addr.save();
        return json(addr.toJSON());
    } else {
        return json(act);
    }
};
