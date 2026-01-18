"use client";

import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto max-w-5xl p-4 md:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
