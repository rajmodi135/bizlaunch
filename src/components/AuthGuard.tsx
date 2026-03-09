"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const isLoginPage = pathname?.startsWith("/login");

    if (!token && !isLoginPage) {
      router.push("/login");
    } else if (token && isLoginPage) {
      // Already logged in? Redirect to dashboard
      router.push("/");
    }
  }, [pathname, router]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.dataset.theme = storedTheme;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(storedTheme);
  }, []);

  // Don't show anything while we check auth status (prevents flickering)
  if (!isAuthenticated && !pathname?.startsWith("/login")) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Hide Sidebar on Login Page
  const isLoginPage = pathname?.startsWith("/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background/50">
        {children}
      </main>
    </div>
  );
}
