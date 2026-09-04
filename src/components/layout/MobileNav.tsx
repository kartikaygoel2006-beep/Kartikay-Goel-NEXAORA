"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function MobileNav({
  links,
  authSlot,
}: {
  links: { href: string; label: string }[];
  authSlot: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-royal-900 hover:bg-royal-50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-cream-200 bg-white px-4 pb-4 shadow-lg">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium text-cream-800 hover:bg-cream-100",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-cream-200 pt-3">{authSlot}</div>
          </nav>
        </div>
      )}
    </div>
  );
}
