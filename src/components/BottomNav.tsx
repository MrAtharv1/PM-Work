"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Wallet } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isWork = pathname === "/work" || pathname === "/";
  const isFinance = pathname.startsWith("/finance");

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around items-center h-16 px-4 md:hidden z-50">
        <Link
          href="/work"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isWork ? "text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs font-medium">Work</span>
        </Link>
        <Link
          href="/finance"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isFinance ? "text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-xs font-medium">Finance</span>
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-border p-6 z-50">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-semibold tracking-tight">PressWork</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/work"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isWork
                ? "bg-gray-100 text-accent font-medium"
                : "text-muted hover:bg-gray-50 hover:text-foreground"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Work</span>
          </Link>
          <Link
            href="/finance"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isFinance
                ? "bg-gray-100 text-accent font-medium"
                : "text-muted hover:bg-gray-50 hover:text-foreground"
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span>Finance</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
