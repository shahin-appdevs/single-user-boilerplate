export type BgFieldProps = Record<string, never>;

/**
 * Fixed decorative background — deep near-black stage with off-center glows
 * (left-center, bottom-center, upper-right), a soft corner vignette, and a
 * masked dot grid. Mirrors the "lit subject on black" hero look. Pure CSS
 * animation (globals keyframes); honors reduced motion.
 */
export function BgField({}: BgFieldProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {/* Glow — left center. Soft, dim edge-lift (image style). */}
      <div
        className="absolute top-1/2 -left-[26vw] h-[62vw] w-[62vw] -translate-y-1/2 rounded-full opacity-60 blur-[130px] [animation:float-a_calc(28s/var(--motion,1))_ease-in-out_infinite] [background:radial-gradient(circle_at_50%_50%,var(--aurora-a),transparent_55%)]"
      />
      {/* Glow — bottom center. Soft, dim edge-lift (image style). */}
      <div
        className="absolute -bottom-[30vw] left-1/2 h-[58vw] w-[58vw] -translate-x-1/2 rounded-full opacity-55 blur-[130px] [animation:float-c_calc(34s/var(--motion,1))_ease-in-out_infinite] [background:radial-gradient(circle_at_50%_50%,var(--aurora-c),transparent_58%)]"
      />
      {/* Dominant glow — top right, warm (behind hero subject). */}
      <div
        className="absolute -top-[28vw] -right-[16vw] h-[46vw] w-[46vw] rounded-full blur-[100px] [animation:float-b_calc(30s/var(--motion,1))_ease-in-out_infinite] [background:radial-gradient(circle_at_50%_50%,var(--aurora-b),transparent_60%)]"
      />
      {/* Vignette — soft pull to base color at the corners; leaves the glows intact. */}
      <div
        className="absolute inset-0 [background:radial-gradient(ellipse_140%_120%_at_50%_50%,transparent_45%,hsl(var(--background)/0.4)_82%,hsl(var(--background)/0.75)_100%)]"
      />
      {/* Masked dot grid. */}
      <div
        className="absolute -inset-[20%] [background-image:radial-gradient(var(--dot)_1.4px,transparent_1.4px)] [background-size:30px_30px] mask-[radial-gradient(ellipse_90%_75%_at_50%_45%,#000_0%,transparent_80%)]"
      />
    </div>
  );
}
