import type { Metadata } from "next";
import "@repo/ui/styles/all.scss";
import "@/styles/main.scss";

import Layout from "@/components/Layout";
export const metadata: Metadata = {
    title: "Tu App",
    description: "From Tu",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className="light" data-theme="corporate">
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
}
