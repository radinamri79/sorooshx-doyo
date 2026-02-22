"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notifications";
import AppShell from "@/components/layout/AppShell";
import Spinner from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { tokens, user, fetchUser } = useAuthStore();
  const { fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (!tokens) {
      router.push("/auth/login");
      return;
    }
    if (!user) {
      fetchUser();
    }
    fetchUnreadCount();
  }, [tokens, user, router, fetchUser, fetchUnreadCount]);

  if (!tokens) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
