"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/primitives/PinInput";
import type { UsePinConfirmReturn } from "@/hooks/user/usePinConfirm";

const PIN_LENGTH = 4;

type Props = Pick<UsePinConfirmReturn, "isOpen" | "state" | "error" | "close" | "submit"> & {
  title?: string;
  description?: string;
};

export function PinConfirmDialog({
  isOpen,
  state,
  error,
  close,
  submit,
  title = "Enter PIN",
  description = "Enter your 4-digit transaction PIN to confirm.",
}: Props) {
  const [pin, setPin] = useState("");
  const submitting = state === "submitting";

  function handleChange(val: string) {
    setPin(val);
    if (val.length === PIN_LENGTH && state !== "submitting") {
      submit(val).finally(() => setPin(""));
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open && !submitting) {
      setPin("");
      close();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm gap-6 p-5 text-center sm:p-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <PinInput
            value={pin}
            onChange={handleChange}
            length={PIN_LENGTH}
            disabled={submitting}
            autoFocus
            allowPaste
            aria-invalid={state === "error"}
          />

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          {submitting && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <Button
          size="lg"
          className="h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
          disabled={pin.length < PIN_LENGTH || submitting}
          onClick={() => submit(pin).finally(() => setPin(""))}
        >
          {submitting ? "Confirming…" : "Confirm"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
