"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable } from "@/components/shared/DataTable";
import { createPaymentLinkColumns } from "./columns";
import { SEED_PAYMENT_LINKS, type PaymentLink } from "./types";

export default function PaymentLinkPage() {
  const t = useTranslations("payLink");
  const router = useRouter();

  const [rows, setRows] = useState<PaymentLink[]>(SEED_PAYMENT_LINKS);
  const [pendingDelete, setPendingDelete] = useState<PaymentLink | null>(null);

  async function copyLink(l: PaymentLink) {
    try {
      await navigator.clipboard.writeText(l.url);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }

  function openEdit(l: PaymentLink) {
    router.push(`/user/payment-link/create?id=${l.id}`);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
    toast.success(t("deleted"));
    setPendingDelete(null);
  }

  const columns = useMemo(
    () =>
      createPaymentLinkColumns(t, {
        onCopy: copyLink,
        onEdit: openEdit,
        onDelete: setPendingDelete,
      }),
    [t],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="glass rounded-2xl p-5">
        <DataTable
          columns={columns}
          data={rows}
          title={t("listTitle")}
          emptyText={t("empty")}
          extra={
            <Button
              size="sm"
              onClick={() => router.push("/user/payment-link/create")}
              className="h-9 [background:var(--gradient)] text-white hover:opacity-90"
            >
              <Plus className="me-1.5 size-4" />
              {t("createLink")}
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
        title={t("deleteTitle")}
        description={t("deleteDescription", { title: pendingDelete?.title ?? "" })}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        onConfirm={confirmDelete}
        destructive
      />
    </div>
  );
}
