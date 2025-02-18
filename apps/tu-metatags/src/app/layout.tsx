import type { Metadata } from "next";
import "@repo/ui/styles/all.scss";
import "@/styles/seo.scss";
import Layout from "@/components/Layout";
import TuRootLayout from "@/components/RootLayout";

/* 

*/
import { CONFIG } from "@/utils/consts";
import { getHost } from "@repo/ui-next/lib/funcs";

const title = `${CONFIG.site} - ${CONFIG.slogan}`;
export const generateMetadata: () => Promise<Metadata> = async () => {
    const host = await getHost();

    return {
        title,
        description:
            CONFIG.slogan,
        openGraph: {
            title,
            description:
                CONFIG.slogan,
            images: `${host}/assets/images/tech.jpg`,
            url: `${host}`,
        },
        twitter: {
            title,
            description:
                CONFIG.slogan,
            images: `${host}/assets/images/tech.jpg`,
            card: "summary_large_image",
            site: "@site",
        },
    };
};
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light" data-theme="light">
            <body>
                <TuRootLayout>
                    <Layout>{children}</Layout>
                </TuRootLayout>
            </body>
        </html>
    );
}
