import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const title = settings?.hero_title || "Studio 1947";
  const subtitle =
    settings?.hero_subtitle ||
    "An administrator hasn't added a hero subtitle yet. Set one from the admin dashboard to introduce Jaipur's heritage here.";

  return (
    <section className="relative overflow-hidden bg-royal-900 text-cream-50">
      <div className="pattern-jaali-gold absolute inset-0 opacity-40" />
      {settings?.hero_image_url && (
        <>
          <Image
            src={settings.hero_image_url}
            alt={settings.hero_image_alt || ""}
            fill
            priority
            className="object-cover opacity-30"
          />
          {settings.hero_image_credit && (
            <p className="absolute bottom-2 right-3 z-10 text-[11px] text-cream-300/80">
              Photo: {settings.hero_image_credit}
            </p>
          )}
        </>
      )}
      <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 sm:py-36">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
          Jaipur &middot; The Pink City
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-cream-200 sm:text-lg">{subtitle}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href={settings?.hero_cta_primary_href || "/explore"}
            variant="primary"
            size="lg"
          >
            {settings?.hero_cta_primary_label || "Explore Jaipur"}
          </Button>
          <Button
            href={settings?.hero_cta_secondary_href || "/crafts"}
            variant="outline-light"
            size="lg"
          >
            {settings?.hero_cta_secondary_label || "Discover Crafts"}
          </Button>
        </div>
      </div>
    </section>
  );
}
