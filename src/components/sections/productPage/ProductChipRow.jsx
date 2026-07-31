import { cn } from "@/lib/utils";

/**
 * Compact label chips for destinations, packing forms, certs.
 * @param {{ label: string, title?: string }[] | string[]} items
 */
export function ProductChipRow({ items = [], className, tone = "light" }) {
  const list = items.map((item) =>
    typeof item === "string" ? { label: item, title: item } : item
  );

  if (!list.length) return null;

  return (
    <ul
      className={cn("flex flex-wrap gap-2", className)}
      aria-label="Key details"
    >
      {list.map((item) => (
        <li key={item.label}>
          <span
            title={item.title || item.label}
            className={cn(
              "inline-flex min-h-9 items-center rounded-full border px-3.5 text-xs font-bold tracking-[0.1em]",
              tone === "light"
                ? "border-white/20 bg-white/[0.05] text-white/85"
                : "border-border bg-surface-2 text-foreground"
            )}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
