import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cream-200 bg-white shadow-sm shadow-cream-900/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
