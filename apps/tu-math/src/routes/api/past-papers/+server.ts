import type { IPaperDocItem, IPastPaper } from '@/lib/interfaces.js'
import { PastPaper, TuApp } from '@/lib/server/models/index.js'
import { tuErr } from '@repo/ui/lib/funcs.js'
import { json } from '@sveltejs/kit'

export const GET = async ({request: req, url}) =>{
    const {year, yo, id, index, type, date} = Object.fromEntries(url.searchParams)

    if (id){
        const paper = await PastPaper.findById(id).exec();
        if (!paper) return tuErr(400, "Could not find paper")
        const _paper = paper.papers.find(el=>el.date == date)
        const doc: IPaperDocItem = _paper.docs[Number(index) - 1][type];
        const title = `${paper.year} ${paper.subject} ${_paper.date} ${doc.name} ${type}`
        return json({title, ...doc})
    }
    if (yo == "true") return json((await TuApp.findOne().exec()).past_papers)
    const pastPapers: {year: string, subjects: IPastPaper[]}[] = []

    const _pastPapers = await PastPaper.find({year}).exec()
    for (let year of _pastPapers.map(el=>el.year)){
        const yearPapers = _pastPapers.filter(el=> el.year == year)
        pastPapers.push({year, subjects: yearPapers.map(el=>({...el.toJSON(), _id: el.id}))})
    }
    return json(pastPapers)
}