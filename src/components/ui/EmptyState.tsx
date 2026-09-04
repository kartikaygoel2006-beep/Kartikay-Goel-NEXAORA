import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pattern-jaali flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && <div className="text-sandstone-400">{icon}</div>}
      <p className="font-display text-xl text-cream-800">{title}</p>
      {description && <p className="max-w-md text-sm text-cream-600">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
