import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sandstone-600">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl text-royal-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-cream-700">{description}</p>}
    </div>
  );
}
