"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Check, RefreshCw, ShieldCheck } from "lucide-react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useRouter } from "@/i18n/navigation";
import type { KycOutcome } from "@/hooks/_shared/useRegisterFlow";
import { Button } from "@/components/ui/button";

export function StepDone({ kycStatus }: { kycStatus: KycOutcome }) {
  const router = useRouter();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const pending = kycStatus === "pending";

  useEffect(() => {
    const el = badgeRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scale: 0.6,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span
        ref={badgeRef}
        className="grid size-20 place-items-center rounded-full text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        <Check className="size-10" />
      </span>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          You&apos;re all set{pending ? "" : ", verified"}!
        </h1>
        <p className="mx-auto mt-2 max-w-[34ch] text-[15px] text-muted-foreground">
          {pending
            ? "Your account is ready. Complete KYC anytime from your dashboard to unlock full limits."
            : "Your identity is verified and your account is fully active."}
        </p>
      </div>

      <span
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold"
        style={
          pending
            ? { backgroundColor: "hsl(38 92% 52% / .16)", color: "hsl(38 86% 44%)" }
            : { backgroundColor: "hsl(150 64% 44% / .14)", color: "hsl(150 64% 40%)" }
        }
      >
        {pending ? (
          <>
            <RefreshCw className="size-4" /> KYC pending
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" /> KYC verified
          </>
        )}
      </span>

      <Button
        type="button"
        onClick={() => router.replace("/user/overview")}
        className="mt-2 h-12 w-full text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        Go to dashboard <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
