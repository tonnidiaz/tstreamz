export const tuImmer = <T>(obj: T, cb: (objCopy: T)=>T)=>{
    return cb({...obj})
}