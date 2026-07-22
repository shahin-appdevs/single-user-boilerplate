"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  /** Style the confirm button as destructive (red). */
  destructive?: boolean;
  /** Disable buttons while an async action runs. */
  loading?: boolean;
}

/** Reusable confirm/cancel modal. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  destructive = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!loading) onOpenChange(o); }}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm gap-5 p-5 sm:p-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-11 flex-1"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            size="lg"
            disabled={loading}
            className={cn(
              "h-11 flex-1 text-white hover:opacity-90",
              destructive ? "bg-destructive" : "[background:var(--gradient)]",
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
