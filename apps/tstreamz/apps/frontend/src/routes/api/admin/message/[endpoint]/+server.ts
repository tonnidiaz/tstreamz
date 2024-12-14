import { SITE } from '@/lib/constants'
import { User } from '@/lib/server/models/index.js'
import { sendMail } from '@cmn/utils/bend/funcs.js'

export const POST = async ({request, params}) =>{
    const {emails, msg, subject, heading} = await request.json()
    const {endpoint} = params
    if (endpoint == "send"){
        for (let email of emails.split(",").trim()){
            const user = await User.findOne({email}).exec()
            const name = user ? user.first_name || user.username : `${SITE} user`
            const res = await sendMail({subject, app: SITE, body: msg, name, clients: email, heading})
            console.log(`Email sent to ${email}`);
        }
       return new Response("Message sent")
    }
}