import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

type FooterColumn = { headingKey: string; links: { labelKey: string; href: string }[] };

const COLUMNS: FooterColumn[] = [
  {
    headingKey: "foot.product",
    links: [
      { labelKey: "nav.home", href: "/" },
      { labelKey: "foot.links.apps", href: "/apps" },
      { labelKey: "foot.links.pricing", href: "/pricing" },
      { labelKey: "foot.links.security", href: "#security" },
    ],
  },
  {
    headingKey: "foot.company",
    links: [
      { labelKey: "foot.links.about", href: "/about-us" },
      { labelKey: "foot.links.careers", href: "#" },
      { labelKey: "foot.links.contact", href: "/contact" },
      { labelKey: "foot.links.partners", href: "#" },
    ],
  },
  {
    headingKey: "foot.resources",
    links: [
      { labelKey: "nav.announcement", href: "/announcement" },
      { labelKey: "foot.links.about", href: "/about-us" },
      { labelKey: "foot.links.status", href: "#" },
      { labelKey: "nav.contact", href: "/contact" },
    ],
  },
  {
    headingKey: "foot.legal",
    links: [
      { labelKey: "foot.links.privacy", href: "/privacy-policy" },
      { labelKey: "foot.links.terms", href: "/terms-and-conditions" },
      { labelKey: "foot.links.refund", href: "/refund-policy" },
      { labelKey: "foot.links.compliance", href: "#security" },
    ],
  },
];

export type FooterColsProps = Record<string, never>;

export async function FooterCols({}: FooterColsProps) {
  const t = await getTranslations("home");
  const tk = t as (key: string) => string;

  return (
    <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
      {COLUMNS.map((col) => (
        <div key={col.headingKey} data-foot className="flex flex-col gap-3">
          <span className="mb-1 text-xs font-bold tracking-[0.1em] text-(--text-3) uppercase">
            {tk(col.headingKey)}
          </span>
          {col.links.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {tk(link.labelKey)}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
