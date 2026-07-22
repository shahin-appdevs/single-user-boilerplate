import { getTranslations } from "next-intl/server";
import { QrCode } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MotionReveal } from "@/components/shared/MotionReveal";

const ITEMS = ["1", "2", "3", "4", "5"];

const EYEBROW =
  "inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold uppercase tracking-[0.18em] text-primary rtl:tracking-[0.04em]";

export type FaqAccordionProps = Record<string, never>;

export async function FaqAccordion({}: FaqAccordionProps) {
  const t = await getTranslations("home");
  const tk = t as (key: string) => string;

  return (
    <section className="py-[clamp(70px,11vw,140px)]">
      <div className="mx-auto grid w-full max-w-[var(--maxw)] grid-cols-1 items-start gap-12 px-7 lg:grid-cols-[0.8fr_1.2fr]">
        <MotionReveal className="flex flex-col gap-4 lg:sticky lg:top-[100px]">
          <span className={EYEBROW}>
            <QrCode className="size-4" />
            {t("faq.eyebrow")}
          </span>
          <h2 className="font-heading text-[clamp(30px,4.2vw,52px)] font-bold tracking-tight text-balance">
            {t("faq.title")}
          </h2>
        </MotionReveal>

        <Accordion
          type="single"
          collapsible
          defaultValue="1"
          className="flex flex-col gap-3"
        >
          {ITEMS.map((i, idx) => (
            <MotionReveal key={i} delay={idx * 0.08}>
              <AccordionItem value={i}>
                <AccordionTrigger>{tk(`faq.q${i}`)}</AccordionTrigger>
                <AccordionContent>{tk(`faq.a${i}`)}</AccordionContent>
              </AccordionItem>
            </MotionReveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
