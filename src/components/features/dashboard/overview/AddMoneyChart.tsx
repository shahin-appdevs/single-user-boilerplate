"use client";

import {
  CheckCircle2,
  Clock,
  PauseCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

/* ── Status palette (fixed — never themed) ──────────────────────────────── */
type StatusKey = "completed" | "pending" | "hold" | "canceled";

const STATUSES: {
  key: StatusKey;
  label: string;
  color: string;
  Icon: LucideIcon;
}[] = [
  { key: "completed", label: "Completed", color: "#0ca30c", Icon: CheckCircle2 },
  { key: "pending",   label: "Pending",   color: "#fab219", Icon: Clock },
  { key: "hold",      label: "Hold",      color: "#ec835a", Icon: PauseCircle },
  { key: "canceled",  label: "Canceled",  color: "#d03b3b", Icon: XCircle },
];

/* ── Mock data — one month of daily amounts by status ───────────────────── */
const DAYS = 30;
const MONTH = "Jul";

// Deterministic pseudo-values (no Date/random) so SSR and client agree.
const series = (base: number, phase: number) =>
  Array.from({ length: DAYS }, (_, i) => {
    const w = (a: number, f: number, p: number) =>
      Math.max(0, Math.round(a + a * 0.6 * Math.sin(i / f + p + phase)));
    return {
      label: `${i + 1} ${MONTH}`,
      completed: w(base, 3.1, 0.4),
      pending: w(base * 0.35, 2.3, 1.7),
      hold: w(base * 0.17, 4.0, 0.9),
      canceled: w(base * 0.13, 2.7, 2.4),
    };
  });

export const ADD_MONEY_DATA = series(520, 0);
export const WITHDRAW_DATA = series(360, 1.2);

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

type TooltipEntry = { name: string; value: number; color: string };

function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: TooltipEntry[];
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="rounded-lg border border-border bg-popover p-2.5 text-xs shadow-md">
      <p className="mb-1.5 font-semibold text-popover-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="ms-auto font-semibold tabular-nums text-popover-foreground">
              {money(p.value)}
            </span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 border-t border-border pt-1">
          <span className="text-muted-foreground">Total</span>
          <span className="ms-auto font-bold tabular-nums text-popover-foreground">
            {money(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

type ChartRow = (typeof ADD_MONEY_DATA)[number];

const grid = "hsl(var(--border))";
const ink = "hsl(var(--muted-foreground))";

function ChartShell({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactElement;
}) {
  return (
    <div className={cn("glass flex flex-col rounded-2xl p-4", className)}>
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {/* Legend — colored dot + label */}
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {STATUSES.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Chart */}
      <div className="min-h-[220px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const gridAxes = (
  <>
    <CartesianGrid stroke={grid} strokeDasharray="4 4" strokeOpacity={0.6} />
    <XAxis
      dataKey="label"
      interval={4}
      tick={{ fill: ink, fontSize: 10 }}
      tickLine={false}
      axisLine={{ stroke: grid }}
    />
    <YAxis
      width={44}
      tick={{ fill: ink, fontSize: 10 }}
      tickLine={false}
      axisLine={false}
      tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
    />
  </>
);

export function StatusAreaChart({
  title,
  data,
  subtitle = "Last 30 days",
  className,
}: {
  title: string;
  data: ChartRow[];
  subtitle?: string;
  className?: string;
}) {
  return (
    <ChartShell title={title} subtitle={subtitle} className={className}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
        {gridAxes}
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: grid, strokeWidth: 1 }} />
        {STATUSES.map(({ key, label, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stackId="1"
            stroke={color}
            strokeWidth={1.5}
            fill={color}
            fillOpacity={0.28}
          />
        ))}
      </AreaChart>
    </ChartShell>
  );
}

export function StatusBarChart({
  title,
  data,
  subtitle = "Last 30 days",
  className,
}: {
  title: string;
  data: ChartRow[];
  subtitle?: string;
  className?: string;
}) {
  return (
    <ChartShell title={title} subtitle={subtitle} className={className}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
        {gridAxes}
        <Tooltip content={<ChartTooltip />} cursor={{ fill: grid, fillOpacity: 0.25 }} />
        {STATUSES.map(({ key, label, color }) => (
          <Bar
            key={key}
            dataKey={key}
            name={label}
            stackId="1"
            fill={color}
            radius={key === "canceled" ? [3, 3, 0, 0] : 0}
          />
        ))}
      </BarChart>
    </ChartShell>
  );
}

export function AddMoneyChart({ className }: { className?: string }) {
  return <StatusAreaChart title="Add Money" data={ADD_MONEY_DATA} className={className} />;
}

export function WithdrawChart({ className }: { className?: string }) {
  return <StatusBarChart title="Withdraw" data={WITHDRAW_DATA} className={className} />;
}
