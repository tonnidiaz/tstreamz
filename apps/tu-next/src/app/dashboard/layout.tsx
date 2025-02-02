import { ReactNode } from "react";

const Layout = ({stats, settings, children} : {stats: ReactNode; settings: ReactNode; children: ReactNode}) => {
    return ( <>
        <div className="p-4 flex flex-col gap-2">
        {children}
        {stats}
        {settings}
        </div>
        
    </> );
}
 
export default Layout;