"use client";

import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";

export default function ForgotPinPage() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight">Forgot your PIN?</h1>
      <p className="max-w-[34ch] text-[15px] text-muted-foreground">
        PIN recovery is coming soon. For now, contact support to reset it.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--primary)" }}
      >
        <ArrowLeft className="size-4" />
        Back to log in
      </Link>
    </div>
  );
}
