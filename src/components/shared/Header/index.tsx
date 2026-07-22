import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shared/Brand";
import { HeaderBar } from "./HeaderBar";
import { HeaderNav } from "./HeaderNav";
import { MobileMenu } from "./MobileMenu";

export type HeaderProps = Record<string, never>;

export async function Header({}: HeaderProps) {
  const t = await getTranslations("home");

  return (
    <HeaderBar>
      <div className="mx-auto flex w-full max-w-[var(--maxw)] items-center justify-between gap-6 px-7">
        <Brand />

        <HeaderNav className="hidden lg:flex " />

        <div className="flex items-center gap-2.5">
          <Button asChild variant="ghost" className="hidden text-[15px] rounded-full lg:inline-flex">
            <Link href="/login">{t("nav.signIn")}</Link>
          </Button>
          <Button
            asChild
            className="hidden rounded-full px-4 border-0 bg-primary text-[15px] font-semibold text-primary-foreground hover:bg-primary/90 lg:inline-flex"
          >
            <Link href="/register">{t("nav.getStarted")}</Link>
          </Button>
          <MobileMenu className="lg:hidden" />
        </div>
      </div>
    </HeaderBar>
  );
}
