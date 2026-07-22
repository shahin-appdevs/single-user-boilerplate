export type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
};

/**
 * Shared marketing page header — eyebrow rule + Playfair heading + lead, over
 * a soft primary glow. Matches the home section language.
 */
export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(600px_300px_at_50%_0%,hsl(var(--primary)/0.18),transparent_70%)]"
      />
      <div className="relative mx-auto flex w-full max-w-[var(--maxw)] flex-col items-center px-7 pt-[clamp(90px,14vw,150px)] pb-[clamp(24px,5vw,56px)] text-center">
        <div className="mb-5 flex items-center gap-3 font-mono text-[12.5px] font-semibold tracking-[0.14em] text-primary uppercase">
          {eyebrow}
        </div>
        <h1 className="max-w-[16ch] font-hero text-[clamp(38px,5.4vw,72px)] leading-[1.04] font-bold tracking-tight text-balance text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
