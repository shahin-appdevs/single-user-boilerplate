import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { CATEGORIES, RECENT } from "./data";

export async function JournalSidebar() {
  const t = await getTranslations("webJournal");

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-[100px]">
      <div className="rounded-3xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 p-6">
        <h4 className="mb-4 font-hero text-lg font-bold text-foreground">
          {t("categories")}
        </h4>
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <li key={c.name}>
              <a
                href="#"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                <span>{c.name}</span>
                <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[12px] font-semibold text-primary">
                  {c.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 p-6">
        <h4 className="mb-4 font-hero text-lg font-bold text-foreground">
          {t("recentPosts")}
        </h4>
        <ul className="flex flex-col gap-4">
          {RECENT.map((r) => (
            <li key={r.title}>
              <Link
                href={`/web-journal-details?id=${r.id}&slug=${r.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")}`}
                className="group flex items-center gap-3.5"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-primary/15">
                  <Image
                    src={r.img}
                    alt={r.title}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[11.5px] text-muted-foreground">
                    {r.date}
                  </span>
                  <span className="line-clamp-2 font-hero text-[14px] leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
                    {r.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
