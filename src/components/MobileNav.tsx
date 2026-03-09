"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Users, FileText, Zap } from "lucide-react";

const items = [
  { href: "/", label: "Home", Icon: LayoutDashboard },
  { href: "/prospects", label: "Find", Icon: Search },
  { href: "/crm", label: "CRM", Icon: Users },
  { href: "/proposals", label: "Docs", Icon: FileText },
  { href: "/tools", label: "Tools", Icon: Zap },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="flex items-stretch justify-between">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center py-2 text-xs font-bold ${active ? "text-blue-500" : "text-slate-500"} hover:text-foreground`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                <span className="mt-0.5">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
