"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import ImpersonationBanner from "./ImpersonationBanner";
import { Menu } from "lucide-react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-stone-50 overflow-hidden">
      <ImpersonationBanner />
      <div className="flex flex-1 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-60">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-stone-500 hover:text-stone-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-rose-600 flex-1">Até o Altar</span>
          <NotificationBell />
        </div>

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-end gap-3 px-6 py-3 bg-white border-b border-stone-100">
          <NotificationBell />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      </div>
    </div>
  );
}
