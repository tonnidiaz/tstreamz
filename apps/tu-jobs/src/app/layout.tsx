import type { Metadata } from "next";
import "@repo/ui/styles/all.scss";
import "@/styles/main.scss";

import Layout from "@/components/Layout";
// export const metadata: Metadata = {
//     title: "Tujobs",
//     description: "From Tu",
// };

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className="light" data-theme="tu_retro">
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
}
