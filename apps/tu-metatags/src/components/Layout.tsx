"use client";

import { CONFIG } from "@/utils/consts";
import Navbar from "@repo/ui-next/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar
                site={CONFIG.site}
                ready={true}
                hasLogin={false}
                menuItems={<></>}
            ></Navbar>
            <div className="tu-app no-bottom-bar">{children}</div>
            <div id="ctx-overlay"></div>
        </>
    );
};

export default Layout;
