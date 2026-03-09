"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  FileText, 
  Zap,
  Globe,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Prospect Finder", href: "/prospects", icon: Search },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Proposal Gen", href: "/proposals", icon: FileText },
  { name: "Audit Tools", href: "/tools", icon: Zap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName] = useState(() => {
    if (typeof window === "undefined") return "User";
    return localStorage.getItem("user_name") || "User";
  });
  const [userRole] = useState(() => {
    if (typeof window === "undefined") return "User";
    return localStorage.getItem("user_role") || "User";
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    return stored ?? "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-background text-foreground border-r border-border shrink-0 transition-colors">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Globe size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">BizLaunch</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-500 hover:bg-border/50 hover:text-foreground"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-foreground"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4 transition-colors">
          <div className="px-4 py-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-border/50 rounded-full flex items-center justify-center text-blue-500 font-bold border border-border">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{userName}</p>
              <p className="text-xs text-slate-500 capitalize">{userRole}</p>
            </div>
          </div>
          <div className="space-y-1">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-border/50 hover:text-foreground transition-all text-sm font-medium"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu FAB (bottom-left) */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-24 left-6 z-50 rounded-full bg-card border border-border text-foreground shadow-lg px-4 py-3"
      >
        <span className="font-bold text-sm">Menu</span>
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-background border-r border-border shadow-xl animate-in slide-in-from-left">
            <div className="p-6 flex items-center gap-3 border-b border-border">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Globe size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">BizLaunch</span>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                        : "text-slate-500 hover:bg-border/50 hover:text-foreground"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border space-y-2">
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-border/50 hover:text-foreground transition-all text-sm font-medium"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-border text-slate-500 hover:bg-border/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
