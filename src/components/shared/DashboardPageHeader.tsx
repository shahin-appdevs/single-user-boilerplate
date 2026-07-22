import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Right-aligned action slot (buttons, filters). */
  actions?: React.ReactNode;
  className?: string;
};

export function DashboardPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
