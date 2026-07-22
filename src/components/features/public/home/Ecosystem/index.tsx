import { getTranslations } from "next-intl/server";

import { SectionHead } from "../SectionHead";
import { EcoCard } from "./EcoCard";

type Eco = { key: string; iconKey: string; chips: string[] };

const ECO: Eco[] = [
  { key: "c1", iconKey: "card", chips: ["Stripe", "PayPal", "Flutterwave", "Paystack"] },
  { key: "c2", iconKey: "globe", chips: ["Wise", "Thunes", "Nium", "Cash pickup"] },
  { key: "c3", iconKey: "message", chips: ["Twilio", "Vonage", "SendGrid", "Mailgun"] },
  { key: "c4", iconKey: "identity", chips: ["Onfido", "Jumio", "Sumsub", "Veriff"] },
];

export type EcosystemProps = Record<string, never>;

export async function Ecosystem({}: EcosystemProps) {
  const t = await getTranslations("home");
  const tk = t as (key: string) => string;

  return (
    <section id="ecosystem" className="py-[clamp(70px,11vw,140px)]">
      <div className="mx-auto w-full max-w-[var(--maxw)] px-4">
        <SectionHead
          eyebrow={t("eco.eyebrow")}
          title={t("eco.title")}
          lead={t("eco.lead")}
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ECO.map((e, i) => (
            <EcoCard
              key={e.key}
              iconKey={e.iconKey}
              chips={e.chips}
              index={i}
              title={tk(`eco.${e.key}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
