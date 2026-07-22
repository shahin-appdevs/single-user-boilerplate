"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/primitives/PinInput";

const PIN_LENGTH = 4;

function PinField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground md:text-sm">{label}</p>
      <PinInput value={value} onChange={onChange} length={PIN_LENGTH} />
    </div>
  );
}

export default function SetupPinPage() {
  const t = useTranslations("pin");

  // TODO: derive from the user's account (whether a PIN is already set).
  const [hasPin, setHasPin] = useState(false);

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

  function submit() {
    if (hasPin && oldPin.length < PIN_LENGTH) {
      toast.error(t("oldRequired"));
      return;
    }
    if (newPin.length < PIN_LENGTH) {
      toast.error(t("newRequired"));
      return;
    }
    // TODO: replace with the set/update-PIN API mutation.
    toast.success(hasPin ? t("updated") : t("created"));
    setHasPin(true);
    setOldPin("");
    setNewPin("");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={hasPin ? t("titleUpdate") : t("titleSet")} subtitle={t("subtitle")} />

      <div className="glass space-y-5 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="size-5 text-primary" />
          </span>
          <p className="text-sm font-semibold">{hasPin ? t("titleUpdate") : t("titleSet")}</p>
        </div>

        {hasPin && (
          <PinField label={t("oldPin")} value={oldPin} onChange={setOldPin} />
        )}

        <PinField label={t("newPin")} value={newPin} onChange={setNewPin} />

        <Button
          size="lg"
          onClick={submit}
          disabled={newPin.length < PIN_LENGTH || (hasPin && oldPin.length < PIN_LENGTH)}
          className="h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
        >
          {hasPin ? t("update") : t("create")}
        </Button>
      </div>
    </div>
  );
}
