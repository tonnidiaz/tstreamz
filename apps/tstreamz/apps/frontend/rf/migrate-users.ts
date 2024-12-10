import { User } from "@/lib/server/models";
import { connectMongo, readJson } from "@cmn/utils/bend/funcs";
import { handleErrs } from "@cmn/utils/funcs";

async function createNewUsers(oldUsers: any[]){
    try {
        for (let oldUser of oldUsers){
            const user = new User()
            try{
                console.log(`Creating ${oldUser.username}`);
                for (let k of Object.keys(oldUser)){
                    let v = oldUser[k]
                    if (k == 'watchlist'){
                        v = JSON.parse(v)
                    }
                    if (k == '_id'){
                        v = v['$oid']
                    } 
                    user.set(k, v)
                }
                user.email_verified = oldUser.is_verified
                user.createdAt = new Date(oldUser.date_created['$date'])
                user.updatedAt = new Date()
                await user.save()
            }catch(err){
                console.log('Failed to create new user');
                handleErrs(err)
            } 
            
        }
    } catch (err) {
        console.log(err);
    }
}
async function main() { 
    await connectMongo(false, 'tunedstreamz')
    const usersCount = await User.find({}).countDocuments().exec()
    const oldUsers = readJson('_data/tunedstreamz.old-users.json')
    console.log({usersCount});
    if (usersCount) return console.log('Delete current users first');
    await createNewUsers(oldUsers)
}

main()