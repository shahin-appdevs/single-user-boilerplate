import { getTranslations } from "next-intl/server";

import { SecurityCard } from "./SecurityCard";
import { SecurityIntro } from "./SecurityIntro";

const CARDS: { key: string; iconKey: string }[] = [
  { key: "p1", iconKey: "key" },
  { key: "p2", iconKey: "fingerprint" },
  { key: "p3", iconKey: "lock" },
  { key: "p4", iconKey: "users" },
  { key: "p5", iconKey: "eye" },
  { key: "p6", iconKey: "book" },
];

const BADGES = ["badge1", "badge2", "badge3"];

export type SecuritySectionProps = Record<string, never>;

export async function SecuritySection({}: SecuritySectionProps) {
  const t = await getTranslations("home");
  const tk = t as (key: string) => string;

  return (
    <section id="security" className="py-[clamp(70px,11vw,140px)]">
      <div className="mx-auto grid w-full max-w-[var(--maxw)] grid-cols-1 items-start gap-12 px-7 lg:grid-cols-[0.92fr_1.08fr]">
        <SecurityIntro
          eyebrow={t("sec.eyebrow")}
          title={t("sec.title")}
          lead={t("sec.lead")}
          badges={BADGES.map((b) => tk(`sec.${b}`))}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <SecurityCard
              key={c.key}
              iconKey={c.iconKey}
              index={i}
              title={tk(`sec.${c.key}t`)}
              description={tk(`sec.${c.key}d`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
