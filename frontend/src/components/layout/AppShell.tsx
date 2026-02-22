"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notifications";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Search,
  ShoppingBag,
  Bell,
  User,
  LogOut,
  Home,
} from "lucide-react";

const navItems = [
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/providers", label: "Providers", icon: Search },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/chat" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Doyo</span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{user?.first_name || user?.email}</span>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-gray-700">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar (Desktop only) */}
        <aside className="hidden md:flex flex-col w-56 border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex flex-col gap-1 p-3 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1",
                  isActive ? "text-primary-600" : "text-gray-500"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
