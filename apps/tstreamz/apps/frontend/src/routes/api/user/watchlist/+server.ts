import { tuErr } from '@/lib/server/funcs'
import { handleErrs } from '@cmn/utils/funcs.js'
import { json } from '@sveltejs/kit'

export const GET = async ({request: req, locals}) =>{
        const user = locals.user
        if (!user) return tuErr(401, "Unauthorized")
        return json(user.watchlist || {})
    
}
export const POST = async ({request: req, locals}) =>{
    try {
        const user = locals.user
        if (!user) return tuErr(401, "Unauthorized")
        const {act, isShow, item} = await req.json()
        let list = (isShow ? user.watchlist.shows : user.watchlist.movies)?.filter?.(it => it.id != item.id) || []
        // First clean the list
        if (act == 'add'){
            console.log('Adding to watchlist...');
            list = [...list, item]
        }else {console.log('Removing watchlist...');}
        console.log(list.length);
        if (isShow) user.watchlist.shows = list
        else user.watchlist.movies = list
        await user.save()
        // console.log(user.watchlist);
        return json(user.watchlist)
    } catch (err) { 
        handleErrs(err)
        tuErr(500, "Failed to update watchlist")
    }
}