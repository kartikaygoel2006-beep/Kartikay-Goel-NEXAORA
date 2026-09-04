"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/heritage-sites", label: "Monuments & Forts" },
  { href: "/admin/crafts", label: "Crafts & Products" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/sources", label: "Sources & Credits" },
  { href: "/admin/site-settings", label: "Home & About Content" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full shrink-0 lg:w-56">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={cn(
                  "block whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium",
                  active
                    ? "bg-royal-900 text-cream-50"
                    : "text-cream-800 hover:bg-cream-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
