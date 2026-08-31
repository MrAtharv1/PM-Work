import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import OfflineIndicator from "@/components/OfflineIndicator";
import InstallPrompt from "@/components/InstallPrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PressWork",
  description: "Printing Press Management System",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PressWork",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F9F9F8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <OfflineIndicator />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:pl-64">
          {children}
        </main>
        <InstallPrompt />
        <BottomNav />
      </body>
    </html>
  );
}
