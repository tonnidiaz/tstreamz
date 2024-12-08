import { handleErrs } from "@cmn/utils/funcs";
import type { IObj } from "@cmn/utils/interfaces";
import { tuErr } from "./funcs";
import { User } from "./models";
import { json } from "@sveltejs/kit";
import bcrypt from 'bcrypt'

export async function updateUser(id: string, body: IObj, f: string) {
        const user = await User.findById(id).exec()
        if (!user) return tuErr(400, 'User does not exist')
        const existingUsername = await User.findOne({username: body.username}).exec(),
            existingEmail = await User.findOne({email: body.email}).exec()
        
            // Validate password first if email | username
            const isUpdatingEmail = body.email && body.email != user.email,
            isUpdatingUsername = body.username && body.username != user.username
            console.log({pwd: body.pwd, });
            if (isUpdatingEmail || isUpdatingUsername){
                if (!bcrypt.compareSync(body.pwd, user.password) ){
                    return tuErr(401, "Password is incorrect")
                }
            }
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
export async function delUser(id: string,) {
        const user = await User.findByIdAndDelete(id).exec()
        if (!user) return tuErr(400, 'User does not exist')
        
        return json({message: "User account deleted"})
    
}