export function StackRibbon({
  items,
  label = "Stack",
}: {
  items: string[];
  label?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <dl
      className="
        mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2
        border-t border-border-subtle pt-5
        font-mono text-[0.7rem] tracking-[0.14em] uppercase
        text-foreground-muted
      "
    >
      <dt className="text-ochre/80">{label}</dt>
      {items.map((item, idx) => (
        <span key={item} className="flex items-baseline gap-3">
          <span aria-hidden className="text-foreground/25">
            {idx === 0 ? "" : "·"}
          </span>
          <dd className="text-foreground">{item}</dd>
        </span>
      ))}
    </dl>
  );
}
