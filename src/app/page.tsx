import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { SiteCard } from "@/components/heritage/SiteCard";
import { ProductCard } from "@/components/heritage/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import {
  getFeaturedHeritageSites,
  getFeaturedProducts,
  getSiteSettings,
} from "@/lib/queries";

export default async function HomePage() {
  const [settings, featuredSites, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getFeaturedHeritageSites(6),
    getFeaturedProducts(6),
  ]);

  return (
    <div>
      <Hero settings={settings} />

      <Container className="py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured"
            title="Monuments &amp; Forts"
            description="A curated selection chosen by the administrator from the published heritage collection."
          />
          <Link href="/explore" className="text-sm font-medium text-royal-700 hover:underline">
            View all monuments &amp; forts &rarr;
          </Link>
        </div>

        {featuredSites.length === 0 ? (
          <EmptyState
            className="mt-8"
            title="No monument added yet"
            description="Once the administrator publishes and features a monument or fort, it will appear here."
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </Container>

      <div className="bg-cream-100 py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Crafts &amp; Products"
              description="Locally relevant crafts and export-worthy products, added and curated by the administrator."
            />
            <Link href="/crafts" className="text-sm font-medium text-royal-700 hover:underline">
              View all crafts &amp; products &rarr;
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <EmptyState
              className="mt-8 bg-cream-50"
              title="No craft or product added yet"
              description="Once the administrator publishes and features a craft or product, it will appear here."
            />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </div>

      <Container className="py-20">
        <SectionHeading
          align="center"
          eyebrow="Our story"
          title="Every monument here was documented by hand"
          description="Studio 1947 does not auto-generate history. Every monument, fort, craft, image and source you see was entered and verified by our administrators — nothing here is scraped or invented."
        />
      </Container>
    </div>
  );
}
