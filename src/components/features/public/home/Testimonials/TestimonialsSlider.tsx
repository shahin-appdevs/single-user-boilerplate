"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export type QuoteItem = {
  initials: string;
  name: string;
  role: string;
  quote: string;
  stars: number;
};

const AUTOPLAY_MS = 4500;

/** Looping, autoplaying testimonial slider (initials avatars). Mirrors the
 * about-page carousel; pauses on hover, arrows + dots, seamless wrap. */
export function TestimonialsSlider({ items }: { items: QuoteItem[] }) {
  const n = items.length;
  const slides = [...items, ...items, ...items];

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  const [index, setIndex] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);

  const real = ((index % n) + n) % n;

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    const card = cardEls.current[index];
    if (!vp || !track || !card) return;
    const vpRect = vp.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const posInTrack = cardRect.left - trackRect.left;
    setOffset(vpRect.width / 2 - posInTrack - cardRect.width / 2);
  }, [index, tick]);

  useEffect(() => {
    const onResize = () => setTick((x) => x + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  const onTransitionEnd = useCallback(() => {
    setIndex((i) => {
      if (i >= 2 * n || i < n) {
        setAnimate(false);
        return (i % n) + n;
      }
      return i;
    });
  }, [n]);

  const goReal = (i: number) => setIndex(n + i);

  return (
    <div
      className="relative mt-13"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Previous"
        onClick={() => setIndex((i) => i - 1)}
        className="absolute top-1/2 left-1 z-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-(--surface-solid) text-foreground ring-1 ring-(--hairline) transition hover:opacity-80 md:-left-4"
      >
        <ChevronLeft className="size-5 rtl:-scale-x-100" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => setIndex((i) => i + 1)}
        className="absolute top-1/2 right-1 z-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-(--surface-solid) text-foreground ring-1 ring-(--hairline) transition hover:opacity-80 md:-right-4"
      >
        <ChevronRight className="size-5 rtl:-scale-x-100" />
      </button>

      <div ref={viewportRef} className="overflow-hidden py-4">
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{
            transform: `translate3d(${offset}px,0,0)`,
            transition: animate
              ? "transform 600ms cubic-bezier(0.22,1,0.36,1)"
              : "none",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {slides.map((item, i) => {
            const isActive = i === index;
            return (
              <div
                key={i}
                ref={(el) => {
                  cardEls.current[i] = el;
                }}
                className={`glass flex w-[clamp(260px,80vw,26rem)] shrink-0 flex-col items-center gap-4 rounded-[28px] p-8 text-center ring-1 transition-[transform,opacity] duration-500 ${
                  isActive
                    ? "scale-100 opacity-100 ring-primary/40"
                    : "scale-[0.92] opacity-55 ring-(--hairline)"
                }`}
              >
                <Quote className="size-9 self-start text-primary/60" />
                <span className="font-heading grid size-16 place-items-center rounded-full bg-(image:--gradient) text-lg font-bold text-white ring-2 ring-primary/30">
                  {item.initials}
                </span>
                <p className="text-[15px] leading-relaxed text-muted-foreground italic">
                  {item.quote}
                </p>
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: item.stars }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <div>
                  <h5 className="font-heading font-bold text-foreground">
                    {item.name}
                  </h5>
                  <p className="text-[13px] text-muted-foreground">
                    {item.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goReal(i)}
            className={`h-2 rounded-full transition-all ${
              i === real
                ? "w-6 bg-(image:--gradient)"
                : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
