"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { useSupportTickets } from "@/hooks/user/useSupportTickets";
import { useAuthStore } from "@/store/authStore";
import type {
  SupportAttachment,
  SupportTicket,
  SupportTicketInput,
} from "@/services/_shared/supportService";
import { createSupportColumns } from "./columns";
import { NewTicketDialog } from "./NewTicketDialog";
import { SupportTicketDetail } from "./SupportTicketDetail";
import { SEED_TICKETS } from "./seed";

// TODO: flip to `true` once the support-tickets API is wired.
const SUPPORT_API_READY = false;

const formatSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} Mb`;

export default function PersonalSupportTickets() {
  const t = useTranslations("supportTicket");
  const user = useAuthStore((s) => s.user);
  const query = useSupportTickets(SUPPORT_API_READY);

  const [rows, setRows] = useState<SupportTicket[]>(SEED_TICKETS);
  const [newOpen, setNewOpen] = useState(false);
  const [viewing, setViewing] = useState<SupportTicket | null>(null);

  const data = SUPPORT_API_READY ? query.data ?? [] : rows;

  function createTicket(input: SupportTicketInput) {
    const attachments: SupportAttachment[] | undefined = input.attachments?.map(
      (f) => ({ name: f.name, sizeLabel: formatSize(f.size) }),
    );
    const ticket: SupportTicket = {
      id: `ST${Date.now().toString().slice(-8)}`,
      name: user?.name ?? "—",
      email: user?.email ?? "—",
      subject: input.subject,
      message: input.message,
      status: "pending",
      lastRepliedAt: new Date().toISOString(),
      attachments,
    };
    setRows((prev) => [ticket, ...prev]);
    toast.success(t("toast.created"));
  }

  const columns = useMemo(
    () => createSupportColumns(t, { onView: setViewing }),
    [t],
  );

  if (viewing) {
    return (
      <SupportTicketDetail ticket={viewing} onBack={() => setViewing(null)} />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="glass rounded-2xl p-5">
        <DataTable
          columns={columns}
          data={data}
          title={t("title")}
          emptyText={t("empty")}
          isLoading={SUPPORT_API_READY && query.isLoading}
          extra={
            <Button
              size="sm"
              onClick={() => setNewOpen(true)}
              className="h-9 [background:var(--gradient)] text-white hover:opacity-90"
            >
              <Plus className="me-1.5 size-4" />
              {t("addNew")}
            </Button>
          }
        />
      </div>

      <NewTicketDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onSubmit={createTicket}
      />
    </div>
  );
}
