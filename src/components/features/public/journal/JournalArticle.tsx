"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarClock } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { DEFAULT_POST, POSTS } from "./data";

const CHIP =
  "inline-flex w-fit items-center rounded-full bg-(image:--gradient) px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase";

export function JournalArticle({ backLabel }: { backLabel: string }) {
  const params = useSearchParams();
  const id = params.get("id") ?? "1";
  const post = POSTS[id] ?? DEFAULT_POST;

  return (
    <article className="glass overflow-hidden rounded-3xl ring-1 ring-(--hairline)">
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <span className={CHIP}>{post.category}</span>
        <h1 className="font-heading text-[clamp(26px,3.6vw,42px)] leading-[1.08] font-extrabold tracking-tight text-balance">
          {post.title}
        </h1>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <CalendarClock className="size-4" /> {post.date}
        </span>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-(--hairline)">
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover"
            priority
          />
        </div>

        <h2 className="font-heading mt-2 text-[clamp(20px,2.4vw,28px)] font-bold tracking-tight">
          {post.subheading}
        </h2>

        {post.body.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}

        <Link
          href="/announcement"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-primary transition hover:gap-2.5"
        >
          <ArrowLeft className="size-4 rtl:-scale-x-100" />
          {backLabel}
        </Link>
      </div>
    </article>
  );
}
