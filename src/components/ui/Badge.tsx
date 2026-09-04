import { cn } from "@/lib/utils";

type Tone = "sandstone" | "royal" | "gold" | "neutral" | "green" | "red";

const toneClasses: Record<Tone, string> = {
  sandstone: "bg-sandstone-100 text-sandstone-800",
  royal: "bg-royal-100 text-royal-800",
  gold: "bg-gold-100 text-gold-800",
  neutral: "bg-cream-200 text-cream-800",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-800",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
