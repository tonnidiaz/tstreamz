import path from "path";
import * as fbr from "flowbite-react/tailwind"
let flowbitePath = import.meta.resolve("flowbite-react/tailwind").replace("file://", "")
flowbitePath = path.relative(import.meta.dirname, flowbitePath)
console.log({flowbitePath});
console.log(fbr.content());