import type { Metadata } from "next";
import { ProductCard } from "@/components/heritage/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Field";
import { getPublishedProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Jaipur Crafts & Products",
  description: "Locally relevant crafts and export products from Jaipur, curated by the administrator.",
};

export default async function CraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const products = await getPublishedProducts(search);

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Jaipur crafts"
        title="Crafts &amp; Products"
        description="Every product here is added by the administrator: name, history, artisan details and how to reach them."
      />

      <form className="mt-8 max-w-md" action="/crafts" method="get">
        <Input name="search" placeholder="Search crafts &amp; products" defaultValue={search ?? ""} />
      </form>

      {products.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No craft or product added yet"
          description="Once the administrator publishes a craft or product, it will appear here."
        />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
