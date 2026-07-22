import { getTranslations } from "next-intl/server";

import { StatsGrid, type StatItem } from "./StatsGrid";

type Stat = { key: string; to: number; decimals?: number; suffix?: string };

const STATS: Stat[] = [
  { key: "s1", to: 30, suffix: "+" },
  { key: "s2", to: 150, suffix: "+" },
  { key: "s3", to: 3 },
  { key: "s4", to: 99.9, decimals: 1, suffix: "%" },
];

export type StatsBandProps = Record<string, never>;

export async function StatsBand({}: StatsBandProps) {
  const t = await getTranslations("home");
  const tk = t as (key: string) => string;

  const items: StatItem[] = STATS.map((s) => ({
    ...s,
    label: tk(`stats.${s.key}`),
  }));

  return (
    <section className="relative z-[1] py-[18px]">
      <div className="mx-auto w-full max-w-[var(--maxw)] px-4">
        <StatsGrid items={items} />
      </div>
    </section>
  );
}
