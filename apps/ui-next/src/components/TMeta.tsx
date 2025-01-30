import { appData } from "@cmn/utils/consts";
import { usePathname } from "next/navigation";
import {useRouter} from "next/router"
import { useEffect, useMemo } from "react";

export interface ITMetaProps {
        title?: string;
        src?: string;
        desc?: string;
        url?: string;
        keywords?: string;
        site?: string;
        slogan?: string;
        siteDesc?: string;
    }


const TMeta = ({
        title,
        src = location.origin + "/assets/images/logo.png",
        desc = ``,
        url: _url,
        site = "Tu",
        slogan = "Tu app",
        siteDesc = "An app from Tu"
    }: ITMetaProps) => {

        const router = useRouter(), pathname = usePathname()
    const _title = `${site} - ${slogan}`;
    let __title = useMemo(()=>(title || _title).trim(), [title])
    
    const _description = useMemo(()=>((desc || '') + '\n' + siteDesc).trim(), [desc]);
    const url = useMemo(()=>pathname, [router.events])

    return ( <><title>
        {__title}
     </title>
     <meta name="description" content={`${_description}`} />
     <meta property="og:type" content="website" />
     <meta property="og:url" content={url} />
     <meta property="og:title" content={__title} />
     <meta property="og:description" content={`${_description}`} />
     <meta property="og:image" content={src} />
 
     <meta property="twitter:card" content="summary_large_image" />
     <meta property="twitter:url" content={url} />
     <meta property="twitter:title" content={__title} />
     <meta property="twitter:description" content={`${_description}`} />
     <meta property="twitter:image" content={src} />
 
     <meta name="author" content={appData.author} />
     <meta name="publisher" content={appData.author} />
     <meta name="copyright" content={site} /></> );
}
 
export default TMeta;