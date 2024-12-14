import { adminEmails } from '@/lib/server/constants.js'
import { User } from '@/lib/server/models/index.js'

export const GET = async ({}) =>{
    const users = await User.find({}).exec()
    for (let user of users){
        console.log(user.email);
        if (adminEmails.includes(user.email)){
            console.log('is_admin');
            user.is_admin = true
        }
        await user.save()
    }
    return new Response("Users updated")
}