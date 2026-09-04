"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { HERITAGE_CATEGORIES, ACCESSIBILITY_LEVELS } from "@/lib/types";
import { Input, Select, Checkbox } from "@/components/ui/Field";

export function FilterBar({ eras, areas }: { eras: string[]; areas: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string | boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-cream-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-cream-800">
          Search
        </label>
        <Input
          id="search"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => updateParam("search", search)}
          onKeyDown={(e) => e.key === "Enter" && updateParam("search", search)}
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-cream-800">
          Category
        </label>
        <Select
          id="category"
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {HERITAGE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="era" className="mb-1.5 block text-sm font-medium text-cream-800">
          Era
        </label>
        <Select
          id="era"
          defaultValue={searchParams.get("era") ?? ""}
          onChange={(e) => updateParam("era", e.target.value)}
        >
          <option value="">All eras</option>
          {eras.map((era) => (
            <option key={era} value={era}>
              {era}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="area" className="mb-1.5 block text-sm font-medium text-cream-800">
          Location / area
        </label>
        <Select
          id="area"
          defaultValue={searchParams.get("area") ?? ""}
          onChange={(e) => updateParam("area", e.target.value)}
        >
          <option value="">All areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="accessibility" className="mb-1.5 block text-sm font-medium text-cream-800">
          Accessibility
        </label>
        <Select
          id="accessibility"
          defaultValue={searchParams.get("accessibility") ?? ""}
          onChange={(e) => updateParam("accessibility", e.target.value)}
        >
          <option value="">Any</option>
          {ACCESSIBILITY_LEVELS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-end">
        <Checkbox
          label="Featured only"
          checked={searchParams.get("featured") === "true"}
          onChange={(e) => updateParam("featured", e.target.checked)}
        />
      </div>
    </div>
  );
}
