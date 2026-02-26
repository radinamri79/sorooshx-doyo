"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Suspense } from "react";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleLogin } = useAuthStore();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      router.push("/auth/login?error=google_denied");
      return;
    }

    if (!code) {
      router.push("/auth/login?error=no_code");
      return;
    }

    processed.current = true;
    googleLogin(code)
      .then(() => router.push("/chat"))
      .catch(() => router.push("/auth/login?error=google_failed"));
  }, [searchParams, googleLogin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-medium">Signing you in...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we connect your Google account.</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-navy-900">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
