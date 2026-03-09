"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import dynamic from "next/dynamic";
const MobileNav = dynamic(() => import("./MobileNav"), { ssr: false });

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
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

  // Hide Sidebar on Login Page
  const isLoginPage = pathname?.startsWith("/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background/50 pb-16 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
