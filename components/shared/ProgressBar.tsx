interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-[color:var(--color-border)]">
      <div
        className="h-full rounded-full bg-[color:var(--color-primary)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      />
    </div>
  );
}
