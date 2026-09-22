import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:brightness-105 active:scale-[0.98]",
  navy: "inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-navy-foreground shadow-soft transition hover:brightness-110 active:scale-[0.98]",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98]",
  grape:
    "inline-flex items-center justify-center gap-2 rounded-full gradient-grape px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 active:scale-[0.98]",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground shadow-soft transition hover:brightness-105 active:scale-[0.98]",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
};

export function Card({
  children,
  className,
  tint,
  hover,
}: {
  children: ReactNode;
  className?: string;
  /** pastel top accent bar */
  tint?: "green" | "purple" | "blue" | "peach" | "red" | "teal";
  hover?: boolean;
}) {
  const tints: Record<string, string> = {
    green: "before:bg-primary",
    purple: "before:bg-grape",
    blue: "before:bg-skyblue",
    peach: "before:bg-sun",
    red: "before:bg-destructive",
    teal: "before:bg-teal",
  };
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft",
        tint && "pt-6 before:absolute before:inset-x-0 before:top-0 before:h-1.5",
        tint && tints[tint],
        hover && "card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  value,
  label,
  icon,
  className,
}: {
  value: string;
  label: string;
  icon?: string;
  className?: string;
}) {
  return (
    <Card hover className={cn("flex items-center gap-4", className)}>
      {icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
          {icon}
        </span>
      )}
      <div>
        <p className="font-display text-xl font-bold leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

export function Badge({
  children,
  tone = "green",
  className,
}: {
  children: ReactNode;
  tone?: "green" | "purple" | "blue" | "peach" | "red" | "grey" | "yellow" | "rose" | "teal";
  className?: string;
}) {
  const tones: Record<string, string> = {
    green: "bg-pastel-green text-emerald-900 dark:text-emerald-100",
    purple: "bg-pastel-purple text-purple-900 dark:text-purple-100",
    blue: "bg-pastel-blue text-blue-900 dark:text-blue-100",
    peach: "bg-pastel-peach text-amber-900 dark:text-amber-100",
    yellow: "bg-pastel-yellow text-yellow-900 dark:text-yellow-100",
    red: "bg-destructive/10 text-destructive",
    rose: "bg-pastel-rose text-rose-900 dark:text-rose-100",
    teal: "bg-pastel-teal text-cyan-900 dark:text-cyan-100",
    grey: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ComingSoon({ className }: { className?: string }) {
  return (
    <Badge tone="peach" className={cn("uppercase tracking-wide", className)}>
      ✨ Coming Soon
    </Badge>
  );
}

export function PetAvatar({
  emoji,
  color,
  size = "md",
  ring,
}: {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const sizes = { sm: "h-9 w-9 text-lg", md: "h-14 w-14 text-2xl", lg: "h-24 w-24 text-5xl" };
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        sizes[size],
        ring && "ring-2 ring-primary ring-offset-2 ring-offset-card",
      )}
      style={{ backgroundColor: `var(--color-${color})` }}
    >
      {emoji}
    </span>
  );
}

/** Stylized demo map with pins — stands in for Google Maps API. */
export function DemoMap({
  pins,
  className,
  label,
}: {
  pins: { emoji: string; top: string; left: string; label?: string }[];
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-pastel-teal/60",
        className,
      )}
    >
      {/* faux roads */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[18%] top-0 h-full w-2 bg-card" />
        <div className="absolute left-[62%] top-0 h-full w-3 bg-card" />
        <div className="absolute left-0 top-[30%] h-2.5 w-full bg-card" />
        <div className="absolute left-0 top-[68%] h-2 w-full bg-card" />
        <div className="absolute left-[38%] top-[30%] h-40 w-40 rounded-full border-8 border-card" />
      </div>
      {pins.map((p, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ top: p.top, left: p.left }}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-navy text-base text-white shadow-lift">
            {p.emoji}
          </span>
          {p.label && (
            <span className="mt-1 block rounded-full bg-card/95 px-2 py-0.5 text-[10px] font-semibold shadow-soft">
              {p.label}
            </span>
          )}
        </div>
      ))}
      <span className="absolute bottom-2 right-2 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] font-semibold text-navy-foreground">
        {label ?? "Demo map · Google Maps API ready"}
      </span>
    </div>
  );
}

/** Friendly empty state — never show a blank screen. */
export function EmptyState({
  icon = "🐾",
  title,
  body,
  action,
  className,
}: {
  icon?: string;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <span aria-hidden className="text-4xl">{icon}</span>
      <p className="mt-3 font-display text-lg font-bold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Skeleton placeholder used while demo data settles. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

/** Simple accessible confirmation dialog (used before destructive/emergency actions). */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/50 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-lift"
      >
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
        <div className="mt-5 flex gap-2">
          <button className={cn(btn.outline, "flex-1")} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={cn(tone === "danger" ? btn.danger : btn.primary, "flex-1")} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
