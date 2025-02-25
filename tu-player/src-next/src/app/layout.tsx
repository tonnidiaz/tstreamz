import "@repo/ui/styles/all.scss";
import "./globals.css"
import TuLayout from "@/components/Layout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
   <TuLayout>{children}</TuLayout>
    
  );
}
