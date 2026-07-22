"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Check, Copy, MessageCircle, QrCode, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QueryState } from "@/components/shared/QueryState";
import { useProfile } from "@/hooks/user/useProfile";
import { payHandle } from "@/services/_shared/profileService";
import { QrImage } from "./QrImage";

function CardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
      <div className="flex justify-center">
        <Skeleton className="size-50 rounded-2xl sm:size-60" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

// TODO: flip to `true` once the profile/me API is wired.
const PROFILE_API_READY = false;
const FALLBACK_HANDLE = "user@appdevs.net";

export default function ReceiveMoneyPage() {
  const t = useTranslations("receive");
  const tc = useTranslations("common");
  const profile = useProfile(PROFILE_API_READY);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handle = profile.data ? payHandle(profile.data) : FALLBACK_HANDLE;

  function copyHandle() {
    navigator.clipboard?.writeText(handle);
    setCopied(true);
    toast.success(t("toast.copied"));
    setTimeout(() => setCopied(false), 1500);
  }

  function shareWhatsApp() {
    const text = `${t("subtitle")}: ${handle}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-140 p-4 dapp:p-6">
      <div className="glass rounded-2xl p-5 sm:p-6">
        <QueryState
          isLoading={PROFILE_API_READY && profile.isLoading && !profile.data}
          isError={PROFILE_API_READY && profile.isError && !profile.data}
          onRetry={() => profile.refetch()}
          errorText={t("error")}
          retryText={tc("retry")}
          skeleton={<CardSkeleton />}
        >
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <QrCode className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-bold leading-tight">{t("title")}</h2>
                <p className="text-xs text-muted-foreground md:text-sm">{t("subtitle")}</p>
              </div>
            </div>

            {/* QR address */}
            <div className="space-y-2">
              <p className="text-xs tracking-wide text-muted-foreground md:text-sm">
                {t("address.label")}
              </p>
              <div className="flex h-11 items-center gap-1 rounded-lg bg-muted/40 ps-3 pe-1 focus-within:ring-3 focus-within:ring-ring/50">
                <input
                  dir="ltr"
                  readOnly
                  value={handle}
                  className="min-w-0 flex-1 cursor-default bg-transparent text-sm font-medium text-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={copyHandle}
                  aria-label={t("address.copy")}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                </button>
              </div>
            </div>

            {/* QR code */}
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white p-4">
                <QrImage value={handle} alt={t("qr.alt")} />
              </div>
            </div>

            {/* Share */}
            <Button
              size="lg"
              onClick={() => setShareOpen(true)}
              className="h-12 w-full [background:var(--gradient)] text-white hover:opacity-90"
            >
              {t("share")}
              <Share2 className="ms-2 size-4" />
            </Button>
          </div>
        </QueryState>
      </div>

      {/* Share modal */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm gap-5 p-5 sm:p-6">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-base font-semibold">{t("shareTitle")}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("subtitle")}
            </DialogDescription>
          </DialogHeader>

          {/* Address + copy */}
          <div className="flex h-11 items-center gap-1 rounded-lg bg-muted/40 ps-3 pe-1">
            <input
              dir="ltr"
              readOnly
              value={handle}
              className="min-w-0 flex-1 cursor-default bg-transparent text-sm font-medium text-foreground outline-none"
            />
            <button
              type="button"
              onClick={copyHandle}
              aria-label={t("address.copy")}
              className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
            </button>
          </div>

          {/* WhatsApp */}
          <Button
            size="lg"
            variant="outline"
            onClick={shareWhatsApp}
            className="h-11 w-full justify-center gap-2"
          >
            <MessageCircle className="size-4 text-emerald-500" />
            {t("whatsapp")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
