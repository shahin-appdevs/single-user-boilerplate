import Image from "next/image";
import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Brand } from "@/components/shared/Brand";
import { FooterReveal } from "./FooterReveal";
import { FooterCols } from "./FooterCols";
import { FooterBottom } from "./FooterBottom";

// Larger badge used in the get-the-app band: icon + two-line label.
const STORE_CTA =
  "group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-2)] px-5 py-3 transition-colors hover:border-[color:var(--hairline-strong)]";

// Silver shine that sweeps left → right on hover.
const SHINE =
  "pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] transition-transform duration-700 ease-out group-hover:translate-x-full";

export type FooterProps = Record<string, never>;

export async function Footer({}: FooterProps) {
  const t = await getTranslations("home");

  return (
    <footer className="relative z-[1] mt-8 overflow-hidden border-t border-[color:var(--hairline)] pt-16 pb-9">
      <Image
        aria-hidden
        src="/images/pertials/network-map.webp"
        alt=""
        width={840}
        height={840}
        className="pointer-events-none absolute inset-0 m-auto h-auto w-full max-w-[900px] object-contain opacity-10"
      />
      <FooterReveal className="relative mx-auto w-full max-w-[var(--maxw)] px-7">
        {/* Get-the-app band */}
        <div className="mb-14 flex flex-col items-start justify-between gap-8 pb-14 lg:flex-row lg:items-center">
          <div data-foot>
            <p className="inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold tracking-[0.18em] text-primary uppercase rtl:tracking-[0.04em]">
              {t("foot.appEyebrow")}
            </p>
            <h2 className="mt-4 max-w-[16ch] font-hero text-[clamp(28px,3.6vw,44px)] leading-[1.05] font-bold tracking-tight text-foreground">
              {t("foot.appTitle")}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#" data-foot className={STORE_CTA}>
              <span className={SHINE} />
              <Image
                src="/images/icons/app-store.png"
                alt=""
                width={26}
                height={26}
                className="size-6 shrink-0 object-contain"
              />
              <span className="flex flex-col leading-none text-start">
                <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  {t("foot.dlAppStore")}
                </span>
                <span className="mt-1 text-[15px] font-semibold text-foreground">
                  {t("foot.appStore")}
                </span>
              </span>
            </a>
            <a href="#" data-foot className={STORE_CTA}>
              <span className={SHINE} />
              <Image
                src="/images/icons/playstore.png"
                alt=""
                width={26}
                height={26}
                className="size-6 shrink-0 object-contain"
              />
              <span className="flex flex-col leading-none text-start">
                <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  {t("foot.dlGooglePlay")}
                </span>
                <span className="mt-1 text-[15px] font-semibold text-foreground">
                  {t("foot.googlePlay")}
                </span>
              </span>
            </a>
            <a href="#" data-foot className={STORE_CTA}>
              <span className={SHINE} />
              <Download className="size-6 shrink-0 text-foreground" />
              <span className="flex flex-col leading-none text-start">
                <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  {t("foot.dlDirect")}
                </span>
                <span className="mt-1 text-[15px] font-semibold text-foreground">
                  {t("foot.apk")}
                </span>
              </span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_2.6fr]">
          <div data-foot className="flex flex-col gap-4">
            <Brand height={32} />
            <p className="max-w-[34ch] text-[14.5px] leading-relaxed text-muted-foreground">
              {t("foot.tag")}
            </p>
          </div>

          <FooterCols />
        </div>

        <FooterBottom />
      </FooterReveal>
    </footer>
  );
}
