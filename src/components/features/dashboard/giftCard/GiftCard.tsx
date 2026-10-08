"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { createGiftCardColumns } from "./columns";
import { GiftCardDetailModal } from "./GiftCardDetailModal";
import { SEED_GIFT_CARDS, type GiftCard } from "./types";

export default function GiftCardPage() {
  const t = useTranslations("gift");
  const router = useRouter();
  const [selected, setSelected] = useState<GiftCard | null>(null);

  const columns = useMemo(() => createGiftCardColumns(t), [t]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="glass rounded-2xl p-5">
        <DataTable
          columns={columns}
          data={SEED_GIFT_CARDS}
          title={t("title")}
          emptyText={t("empty")}
          onRowClick={setSelected}
          extra={
            <Button
              size="sm"
              onClick={() => router.push("/user/gift-card/list")}
              className="h-9 [background:var(--gradient)] text-white hover:opacity-90"
            >
              <Plus className="me-1.5 size-4" />
              {t("giftCards")}
            </Button>
          }
        />
      </div>

      <GiftCardDetailModal
        card={selected}
        open={!!selected}
        onOpenChange={(o) => { if (!o) setSelected(null); }}
      />
    </div>
  );
}
