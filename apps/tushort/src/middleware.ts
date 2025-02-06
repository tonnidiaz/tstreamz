import { tuErr } from "@repo/ui-next/lib/funcs";
import { NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest)=>{
    console.log("\n[MIDDLEWARE]");
    console.log(req.url);
    const user = req.nextUrl.searchParams.get('user')
    // const res = NextResponse.next()
    if (user != 'tonni'){
         return tuErr("UNAUTHORIZED", 401)
        
    }
}
export const config = {
    matcher: ['/admin/:path*']
}