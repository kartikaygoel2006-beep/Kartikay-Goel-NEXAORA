"use client";

import { useState } from "react";
import Image from "next/image";
import type { HeritageImage } from "@/lib/types";

export function Gallery({
  images,
  coverImageUrl,
  coverImageAlt,
  coverImageCredit,
  title,
}: {
  images: HeritageImage[];
  coverImageUrl: string | null;
  coverImageAlt?: string | null;
  coverImageCredit?: string | null;
  title: string;
}) {
  const slides = images.length
    ? images
    : coverImageUrl
      ? [
          {
            id: "cover",
            url: coverImageUrl,
            alt_text: coverImageAlt || title,
            caption: null,
            photographer_credit: coverImageCredit || "",
          } as HeritageImage,
        ]
      : [];

  const [active, setActive] = useState(0);

  if (slides.length === 0) {
    return (
      <div className="pattern-jaali flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-50 text-cream-500">
        No photos added yet
      </div>
    );
  }

  const current = slides[active];

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cream-200">
        <Image
          src={current.url}
          alt={current.alt_text}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-cream-600">
        <span>{current.caption}</span>
        {current.photographer_credit && <span>Photo credit: {current.photographer_credit}</span>}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {slides.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(idx)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                idx === active ? "border-sandstone-600" : "border-transparent"
              }`}
              aria-label={`Show photo ${idx + 1}`}
            >
              <Image src={img.url} alt={img.alt_text} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
