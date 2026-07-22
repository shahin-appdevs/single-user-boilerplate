import { getTranslations } from "next-intl/server";

import { SectionHead } from "../SectionHead";
import { FeatureCard, type FeatureCardProps } from "./FeatureCard";

type Feature = {
  key: string;
  iconKey: string;
  size?: FeatureCardProps["size"];
};

const FEATURES: Feature[] = [
  { key: "f1", iconKey: "wallet", size: "lg" },
  { key: "f2", iconKey: "qr", size: "tall" },
  { key: "f3", iconKey: "send" },
  { key: "f4", iconKey: "card" },
  { key: "f5", iconKey: "globe" },
  { key: "f6", iconKey: "exchange" },
  { key: "f7", iconKey: "gift" },
  { key: "f8", iconKey: "shield", size: "wide" },
];

export type FeaturesBentoProps = Record<string, never>;

export async function FeaturesBento({}: FeaturesBentoProps) {
  const t = await getTranslations("home");
  const tk = t as (key: string) => string;

  return (
    <section id="features" className="py-[clamp(70px,11vw,140px)]">
      <div className="mx-auto w-full max-w-[var(--maxw)] px-4">
        <SectionHead
          eyebrow={t("feat.eyebrow")}
          title={t("feat.title")}
          lead={t("feat.lead")}
        />
        <div className="mt-14 grid auto-rows-auto grid-cols-1 gap-4.5 [grid-auto-flow:dense] sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.key}
              iconKey={f.iconKey}
              size={f.size}
              index={i}
              title={tk(`feat.${f.key}t`)}
              description={tk(`feat.${f.key}d`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
