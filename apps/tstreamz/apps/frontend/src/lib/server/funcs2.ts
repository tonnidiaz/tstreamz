import { handleErrs } from "@cmn/utils/funcs";
import type { IObj } from "@cmn/utils/interfaces";
import { tuErr } from "./funcs";
import { User } from "./models";
import { json } from "@sveltejs/kit";

export async function updateUser(id: string, body: IObj, f: string) {
    try{
        const user = await User.findById(id).exec()
        if (!user) return tuErr(400, 'User does not exist')
        const existingUsername = await User.findOne({username: body.username}).exec(),
            existingEmail = await User.findOne({email: body.email}).exec()
        if (f == 'info'){
            if (existingEmail && existingEmail.id != user.id) return tuErr(400, "Email address already exists")
            if (existingUsername && existingUsername.id != user.id) return tuErr(400, "Username address already exists")

            for (let k of Object.keys(body)){
                const v = body[k]
                user.set(k, v)
            }
        }

        await user.save()
        return json(user.toJSON())
    }
    catch(err){handleErrs(err); tuErr(500, "Failed to update user")}
}
export async function delUser(id: string,) {
    try{
        const user = await User.findByIdAndDelete(id).exec()
        if (!user) return tuErr(400, 'User does not exist')
        
        return json({message: "User account deleted"})
    }
    catch(err){handleErrs(err); tuErr(500, "Failed to delete account")}
}