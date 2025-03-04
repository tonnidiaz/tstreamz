
import { json } from "@sveltejs/kit";
import { handleErrs, isEmail } from "@cmn/utils/funcs";
import { tuErr } from "@/lib/server/funcs";
import { User } from "@pkg/cmn/models";

import { genToken, verifyPwd } from "@cmn/utils/bend/funcs";

export const POST = async ({request: req, locals})=>{
        const { username, password } = await req.json();
        if (locals.user && !password) {
            return json({ user: { ...(locals.user).toJSON() } });
        } 
        else if (username && password) {
            const q = isEmail(username) ? { email: username } : { username };
            let user = await User.findOne(q).exec();
            if (user) {
                const passValid = await verifyPwd(password, user.password);

                if (!passValid)
                    return tuErr(400, "Incorrect password.");
                const token = genToken({ id: user._id });
                return json({ user: { ...user.toJSON() }, token });
            } else return tuErr( 400, "Account does not exist");
        } else {
           return tuErr(400, "Provide all fields");
        }
    
}

