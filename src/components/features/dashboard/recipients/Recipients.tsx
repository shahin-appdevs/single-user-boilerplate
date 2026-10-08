"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable } from "@/components/shared/DataTable";
import { useRecipients } from "@/hooks/user/useRecipients";
import type { Recipient } from "@/services/dashboard/recipientService";
import { createRecipientColumns } from "./columns";
import { SEED_RECIPIENTS } from "./recipientFields";

// TODO: flip to `true` once the recipients API is wired.
const RECIPIENTS_API_READY = false;

export default function RecipientsPage() {
  const t = useTranslations("recipients");
  const router = useRouter();
  const query = useRecipients(RECIPIENTS_API_READY);

  const [rows, setRows] = useState<Recipient[]>(SEED_RECIPIENTS);
  const [pendingDelete, setPendingDelete] = useState<Recipient | null>(null);

  const data = RECIPIENTS_API_READY ? query.data ?? [] : rows;

  function openEdit(r: Recipient) {
    router.push(`/user/recipients/edit?id=${r.id}`);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
    toast.success(t("toast.deleted"));
    setPendingDelete(null);
  }

  const columns = useMemo(
    () => createRecipientColumns(t, { onEdit: openEdit, onDelete: setPendingDelete }),
    [t],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="glass rounded-2xl p-5">
        <DataTable
          columns={columns}
          data={data}
          title={t("title")}
          emptyText={t("empty")}
          extra={
            <Button
              size="sm"
              onClick={() => router.push("/user/recipients/add")}
              className="h-9 [background:var(--gradient)] text-white hover:opacity-90"
            >
              {t("addNew")}
              <Plus className="ms-1.5 size-4" />
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: pendingDelete?.name ?? "" })}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        onConfirm={confirmDelete}
        destructive
      />
    </div>
  );
}
