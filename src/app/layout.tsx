import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PressWork",
  description: "Printing Press Management System",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:pl-64">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
