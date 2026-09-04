import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/app/login/actions";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const links = [
  { href: "/explore", label: "Explore Jaipur" },
  { href: "/crafts", label: "Crafts & Products" },
  { href: "/sources", label: "Research Sources" },
  { href: "/about", label: "About" },
];

export async function Navbar() {
  const { profile, email } = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const authSlot = isAdmin ? (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button href="/admin" size="sm" variant="secondary">
        Admin dashboard
      </Button>
      <form action={signOut}>
        <button
          type="submit"
          className="text-sm font-medium text-cream-700 hover:text-sandstone-700"
        >
          Sign out{email ? ` (${email})` : ""}
        </button>
      </form>
    </div>
  ) : (
    <Button href="/login" size="sm" variant="outline">
      Admin login
    </Button>
  );

  return (
    <header className="relative z-50 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl tracking-wide text-royal-900">Studio 1947</span>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-sandstone-600 sm:inline">
            Jaipur Heritage
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream-800 transition-colors hover:text-sandstone-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block">{authSlot}</div>

        <MobileNav links={links} authSlot={authSlot} />
      </Container>
    </header>
  );
}
