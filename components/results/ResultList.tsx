interface ResultListProps {
  items: string[];
  emptyLabel: string;
  variant?: 'bullet' | 'dot';
}

export function ResultList({ items, emptyLabel, variant = 'bullet' }: ResultListProps) {
  if (!items.length) {
    return <p className="text-sm italic text-[color:var(--color-text-placeholder)]">{emptyLabel}</p>;
  }
  if (variant === 'dot') {
    return (
      <ul className="space-y-2 text-sm text-[color:var(--color-text-body)]">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-primary)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-[color:var(--color-text-body)]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
