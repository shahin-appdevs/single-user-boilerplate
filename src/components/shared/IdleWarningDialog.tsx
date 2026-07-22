"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  secondsRemaining: number;
  onStay: () => void;
  onLogout: () => void;
};

export function IdleWarningDialog({
  open,
  secondsRemaining,
  onStay,
  onLogout,
}: Props) {
  const t = useTranslations();

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        // Force a choice — not dismissible by overlay click or Esc.
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("auth.idleTitle")}</DialogTitle>
          <DialogDescription>
            {t("auth.idleDescription", { seconds: secondsRemaining })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onLogout}>
            {t("auth.logoutNow")}
          </Button>
          <Button variant="default" onClick={onStay}>
            {t("auth.stay")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
