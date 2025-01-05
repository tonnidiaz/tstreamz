import { clearTerminal } from "@cmn/utils/funcs"

export const GET = () =>{
    clearTerminal()
    return new Response("Cleared")
}