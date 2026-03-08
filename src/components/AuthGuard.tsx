"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const isLoginPage = pathname?.startsWith("/login");

    if (!token && !isLoginPage) {
      setIsAuthenticated(false);
      router.push("/login");
    } else if (token && isLoginPage) {
      // Already logged in? Redirect to dashboard
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Don't show anything while we check auth status (prevents flickering)
  if (isAuthenticated === null || (isAuthenticated === false && !pathname?.startsWith("/login"))) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Hide Sidebar on Login Page
  const isLoginPage = pathname?.startsWith("/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}
