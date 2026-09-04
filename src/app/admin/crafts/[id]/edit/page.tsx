import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../../ProductForm";
import { updateProduct } from "../../actions";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { SourceLinkManager } from "@/components/admin/SourceLinkManager";
import { SiteLinkManager } from "@/components/admin/SiteLinkManager";
import { addGalleryImage } from "@/app/admin/images/actions";
import { linkSite, linkSource } from "@/app/admin/links/actions";
import type { HeritageImage, HeritageSite, Location, ProductOrCraft, Source, SourceLink } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: productData },
    { data: locationsData },
    { data: imagesData },
    { data: sourceLinksData },
    { data: allSourcesData },
    { data: allSitesData },
    { data: linkedSitesData },
  ] = await Promise.all([
    supabase.from("products_or_crafts").select("*, location:locations(*)").eq("id", id).maybeSingle(),
    supabase.from("locations").select("*").order("city"),
    supabase.from("heritage_images").select("*").eq("product_id", id).order("display_order"),
    supabase.from("source_links").select("*, source:sources(*)").eq("product_id", id),
    supabase.from("sources").select("*").order("title"),
    supabase.from("heritage_sites").select("*").order("name"),
    supabase.from("site_product_links").select("site:heritage_sites(*)").eq("product_id", id),
  ]);

  const product = productData as ProductOrCraft | null;
  if (!product) notFound();

  const revalidateTo = `/admin/crafts/${id}/edit`;
  const linkedSites = ((linkedSitesData ?? []) as unknown as { site: HeritageSite }[]).map((r) => r.site);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-2xl text-royal-900">Edit: {product.name}</h2>
        <div className="mt-6">
          <ProductForm
            product={product}
            locations={(locationsData as Location[]) ?? []}
            action={updateProduct.bind(null, id)}
          />
        </div>
      </div>

      <div className="border-t border-cream-200 pt-8">
        <h3 className="font-display text-xl text-royal-900">Photo gallery</h3>
        <div className="mt-4">
          <GalleryManager
            images={(imagesData as HeritageImage[]) ?? []}
            pathPrefix={`products/${id}`}
            revalidateTo={revalidateTo}
            addAction={addGalleryImage.bind(null, "product", id, revalidateTo)}
          />
        </div>
      </div>

      <div className="border-t border-cream-200 pt-8">
        <h3 className="font-display text-xl text-royal-900">Related monuments &amp; places</h3>
        <div className="mt-4">
          <SiteLinkManager
            productId={id}
            linkedSites={linkedSites}
            allSites={(allSitesData as HeritageSite[]) ?? []}
            revalidateTo={revalidateTo}
            linkAction={linkSite.bind(null, id, revalidateTo)}
          />
        </div>
      </div>

      <div className="border-t border-cream-200 pt-8">
        <h3 className="font-display text-xl text-royal-900">Sources &amp; references</h3>
        <div className="mt-4">
          <SourceLinkManager
            links={(sourceLinksData as SourceLink[]) ?? []}
            allSources={(allSourcesData as Source[]) ?? []}
            revalidateTo={revalidateTo}
            linkAction={linkSource.bind(null, "product", id, revalidateTo)}
          />
        </div>
      </div>
    </div>
  );
}
