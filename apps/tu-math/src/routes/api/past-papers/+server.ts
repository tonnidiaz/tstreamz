import type { IPastPaper } from '@/lib/interfaces.js'
import { PastPaper, TuApp } from '@/lib/server/models/index.js'
import { json } from '@sveltejs/kit'

export const GET = async ({request: req, url}) =>{
    const {year, yo} = Object.fromEntries(url.searchParams)

    if (yo == "true") return json((await TuApp.findOne().exec()).past_papers)
    const pastPapers: {year: string, subjects: IPastPaper[]}[] = []

    const _pastPapers = await PastPaper.find({year}).exec()
    for (let year of _pastPapers.map(el=>el.year)){
        const yearPapers = _pastPapers.filter(el=> el.year == year)
        pastPapers.push({year, subjects: yearPapers.map(el=>el.toJSON())})
    }
    return json(pastPapers)
}