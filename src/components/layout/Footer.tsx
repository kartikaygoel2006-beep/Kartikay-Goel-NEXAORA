import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="pattern-jaali mt-24 border-t border-cream-200 bg-royal-900 text-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-cream-50">Studio 1947</p>
          <p className="mt-3 max-w-xs text-sm text-cream-300">
            A living archive of Jaipur&rsquo;s monuments, forts, crafts and stories —
            documented one entry at a time.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/explore" className="hover:text-gold-200">
                Monuments &amp; Forts
              </Link>
            </li>
            <li>
              <Link href="/crafts" className="hover:text-gold-200">
                Crafts &amp; Products
              </Link>
            </li>
            <li>
              <Link href="/sources" className="hover:text-gold-200">
                Research Sources
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            About
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-gold-200">
                Our project
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-gold-200">
                Administrator login
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-royal-800 py-5 text-center text-xs text-cream-400">
        © {new Date().getFullYear()} Studio 1947. All monument, craft and source content is
        curated by the site administrator.
      </div>
    </footer>
  );
}
