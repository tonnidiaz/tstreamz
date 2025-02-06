import type { Metadata } from "next";
import "@repo/ui/styles/all.scss";
import Layout from "@/components/Layout";
import TuRootLayout from "@/components/RootLayout";
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
        <html lang="en" className="dark" data-theme="tb">
            <body>
                <TuRootLayout>
                    <Layout>{children}</Layout>
                </TuRootLayout>
            </body>
        </html>
    );
}
