"use client";

import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Recipient = {
  id: string;
  name: string;
  identifier: string;
  initials: string;
};

const MOCK_RECIPIENTS: Recipient[] = [
  { id: "1", name: "Alice Rahman",   identifier: "+880 1711-000001", initials: "AR" },
  { id: "2", name: "Bob Hossain",    identifier: "bob@email.com",    initials: "BH" },
  { id: "3", name: "Carol Ahmed",    identifier: "carol@qrpay",      initials: "CA" },
  { id: "4", name: "David Khan",     identifier: "+880 1811-000004", initials: "DK" },
  { id: "5", name: "Eva Sultana",    identifier: "eva@email.com",    initials: "ES" },
  { id: "6", name: "Farhan Islam",   identifier: "+880 1911-000006", initials: "FI" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (identifier: string) => void;
};

export function RecipientListDialog({ isOpen, onClose, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      MOCK_RECIPIENTS.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.identifier.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  function handleSelect(r: Recipient) {
    onSelect(r.identifier);
    setSearch("");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm gap-0 p-0">
        <DialogHeader className="px-4 pt-4 pb-3">
          <DialogTitle className="text-sm font-semibold">Select Recipient</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex h-9 items-center gap-2 rounded-lg bg-muted/40 px-3 focus-within:ring-3 focus-within:ring-ring/50">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search name or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto pb-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <User className="size-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No recipients found</p>
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelect(r)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-muted/60"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.identifier}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
