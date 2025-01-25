import { verifyCron } from "./utils/funcs"
import { jobSpecs } from "./utils/funcs2"
import cp from 'cron-parser'
export {}

const testCron = ()=>{
    const specs = jobSpecs(60*24)
    console.log({specs});
    const p = cp.parseExpression(specs)
    console.log(p.fields);
    const r = verifyCron(specs, new Date("2024-01-01 00:05:00+02:00"))
    console.log({r});
}

testCron()