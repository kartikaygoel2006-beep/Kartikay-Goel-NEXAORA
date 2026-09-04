import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HeritageSiteForm } from "../../HeritageSiteForm";
import { updateHeritageSite } from "../../actions";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { SourceLinkManager } from "@/components/admin/SourceLinkManager";
import { ProductLinkManager } from "@/components/admin/ProductLinkManager";
import { addGalleryImage } from "@/app/admin/images/actions";
import { linkSource, linkProduct } from "@/app/admin/links/actions";
import type { HeritageImage, HeritageSite, Location, ProductOrCraft, Source, SourceLink } from "@/lib/types";

export default async function EditHeritageSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: siteData },
    { data: locationsData },
    { data: imagesData },
    { data: sourceLinksData },
    { data: allSourcesData },
    { data: allProductsData },
    { data: linkedProductsData },
  ] = await Promise.all([
    supabase.from("heritage_sites").select("*, location:locations(*)").eq("id", id).maybeSingle(),
    supabase.from("locations").select("*").order("city"),
    supabase.from("heritage_images").select("*").eq("heritage_site_id", id).order("display_order"),
    supabase.from("source_links").select("*, source:sources(*)").eq("heritage_site_id", id),
    supabase.from("sources").select("*").order("title"),
    supabase.from("products_or_crafts").select("*").order("name"),
    supabase
      .from("site_product_links")
      .select("product:products_or_crafts(*)")
      .eq("heritage_site_id", id),
  ]);

  const site = siteData as HeritageSite | null;
  if (!site) notFound();

  const revalidateTo = `/admin/heritage-sites/${id}/edit`;
  const linkedProducts = ((linkedProductsData ?? []) as unknown as { product: ProductOrCraft }[]).map(
    (r) => r.product,
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-2xl text-royal-900">Edit: {site.name}</h2>
        <div className="mt-6">
          <HeritageSiteForm
            site={site}
            locations={(locationsData as Location[]) ?? []}
            action={updateHeritageSite.bind(null, id)}
          />
        </div>
      </div>

      <div className="border-t border-cream-200 pt-8">
        <h3 className="font-display text-xl text-royal-900">Photo gallery</h3>
        <div className="mt-4">
          <GalleryManager
            images={(imagesData as HeritageImage[]) ?? []}
            pathPrefix={`heritage-sites/${id}`}
            revalidateTo={revalidateTo}
            addAction={addGalleryImage.bind(null, "heritage_site", id, revalidateTo)}
          />
        </div>
      </div>

      <div className="border-t border-cream-200 pt-8">
        <h3 className="font-display text-xl text-royal-900">Related crafts &amp; products</h3>
        <div className="mt-4">
          <ProductLinkManager
            heritageSiteId={id}
            linkedProducts={linkedProducts}
            allProducts={(allProductsData as ProductOrCraft[]) ?? []}
            revalidateTo={revalidateTo}
            linkAction={linkProduct.bind(null, id, revalidateTo)}
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
            linkAction={linkSource.bind(null, "heritage_site", id, revalidateTo)}
          />
        </div>
      </div>
    </div>
  );
}
