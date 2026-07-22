"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { Brand } from "@/components/shared/Brand";
import { NAV } from "./nav.config";

export type MobileMenuProps = {
  className?: string;
};

export function MobileMenu({ className }: MobileMenuProps) {
  const t = useTranslations("home") as (key: string) => string;
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className={className}
          aria-label={t("nav.menu")}
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between border-b border-[color:var(--hairline)] px-5 py-4">
          <Brand height={22} />
          <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
        </SheetHeader>

        {/* Scrollable nav */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-3 py-2">
            <Accordion type="single" collapsible className="w-full">
              {NAV.map((item, i) => {
                if (item.kind === "link") {
                  return (
                    <Link
                      key={item.labelKey}
                      href={item.href}
                      onClick={close}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {t(item.labelKey)}
                      
                    </Link>
                  );
                }

                return (
                  <AccordionItem
                    key={item.labelKey}
                    value={String(i)}
                    className="border-0"
                  >
                    <AccordionTrigger className="rounded-xl px-3 py-3 text-[15px] font-semibold text-foreground/80 hover:bg-muted hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
                      {t(item.labelKey)}
                    </AccordionTrigger>

                    <AccordionContent className="pb-2 ps-2">
                      {/* Groups */}
                      <div className="flex flex-col gap-4">
                        {item.groups.map((group) => (
                          <div key={group.headingKey}>
                            <span className="mb-1.5 block px-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-3)]">
                              {t(group.headingKey)}
                            </span>
                            <ul className="flex flex-col gap-0.5">
                              {group.links.map((link) => {
                                const Icon = link.icon;
                                return (
                                  <li key={link.labelKey}>
                                    <Link
                                      href={link.href}
                                      onClick={close}
                                      className="group/link flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                                    >
                                      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-2)] transition-colors group-hover/link:border-primary/40 group-hover/link:text-primary">
                                        <Icon className="size-[15px]" />
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {t(link.labelKey)}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Side card */}
                      {item.side && (
                        <Link
                          href={item.side.href}
                          onClick={close}
                          className="mt-4 flex flex-col gap-1.5 overflow-hidden rounded-2xl border border-[color:var(--hairline)] p-4 transition-colors hover:border-primary/40 [background:linear-gradient(135deg,color-mix(in_srgb,hsl(var(--grad-from))_18%,var(--surface-2)),var(--surface-2)_70%)]"
                        >
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                            {t(item.side.kickKey)}
                          </span>
                          <span className="text-sm font-bold tracking-tight">
                            {t(item.side.titleKey)}
                          </span>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {t(item.side.descKey)}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            {t("nav.learnMore")}
                            <ArrowRight className="size-3 rtl:-scale-x-100" />
                          </span>
                        </Link>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-[color:var(--hairline)] px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <div className="flex gap-2.5">
            <Button asChild variant="outline" className="flex-1 rounded-full">
              <Link href="/apps" onClick={close}>
                {t("nav.downloadApp")}
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 rounded-full border-0 bg-[image:var(--gradient)] text-white hover:opacity-90"
            >
              <Link href="/login" onClick={close}>
                {t("nav.login")}
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
