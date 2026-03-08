"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Settings, 
  FileText, 
  Zap,
  Globe,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
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

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-white border-r border-slate-800 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
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
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-white" : "text-slate-500 group-hover:text-white"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
