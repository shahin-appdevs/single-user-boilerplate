import { getTranslations } from "next-intl/server";

const WORDMARKS = [
  "Visa",
  "Mastercard",
  "Stripe",
  "Flutterwave",
  "Paystack",
  "Twilio",
  "Wise",
  "PayPal",
  "Onfido",
  "Plaid",
];

export type TrustMarqueeProps = Record<string, never>;

export async function TrustMarquee({}: TrustMarqueeProps) {
  const t = await getTranslations("home");
  // Duplicated track → seamless -50% loop.
  const track = [...WORDMARKS, ...WORDMARKS];

  return (
    <section className="relative z-[1] pt-2 pb-9">
      <p className="mb-6 text-center text-[13.5px] tracking-[0.04em] text-[color:var(--text-3)]">
        {t("trust.label")}
      </p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max gap-[60px] [animation:scroll-x_calc(40s/var(--motion,1))_linear_infinite] will-change-transform group-hover:[animation-play-state:paused] rtl:[animation-direction:reverse]">
          {track.map((mark, i) => (
            <span
              key={`${mark}-${i}`}
              dir="ltr"
              className="font-heading text-2xl font-bold tracking-tight whitespace-nowrap text-[color:var(--text-3)] opacity-60 transition-opacity hover:opacity-100"
            >
              {mark}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
