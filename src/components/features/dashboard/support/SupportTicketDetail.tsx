"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Download,
  FileText,
  MoreHorizontal,
  Paperclip,
  Phone,
  Send,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/dashboard/initials";
import type {
  SupportTicket,
  SupportTicketStatus,
} from "@/services/_shared/supportService";

interface Props {
  ticket: SupportTicket;
  onBack: () => void;
}

type ChatMessage = {
  id: string;
  author: "me" | "agent";
  text: string;
  time: string;
};

const STATUS_STYLES: Record<SupportTicketStatus, string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  open: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  answered: "bg-primary/15 text-primary",
  closed: "bg-muted text-muted-foreground",
};

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date).replace(":", ".");

export function SupportTicketDetail({ ticket, onBack }: Props) {
  const t = useTranslations("supportTicket");

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "seed-1",
      author: "me",
      text: ticket.message ?? ticket.subject,
      time: "15.31",
    },
    {
      id: "seed-2",
      author: "agent",
      text: t("detail.autoReply"),
      time: "15.33",
    },
  ]);
  const [draft, setDraft] = useState("");

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${prev.length}`, author: "me", text, time: formatTime(new Date()) },
    ]);
    setDraft("");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[320px_1fr] dapp:p-6">
      {/* Left — support details */}
      <aside className="glass h-fit space-y-4 rounded-2xl p-5 lg:h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ms-2 h-8 gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("detail.back")}
          </Button>
          <Badge className={cn("border-0 capitalize", STATUS_STYLES[ticket.status])}>
            {t(`status.${ticket.status}`)}
          </Badge>
        </div>

        <p className="text-sm font-semibold">{t("detail.supportDetails")}</p>

        <dl className="space-y-3 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">{t("table.subject")}</dt>
            <dd className="text-end font-medium">{ticket.subject}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">{t("detail.description")}</dt>
            <dd className="text-end font-medium">{ticket.message ?? "—"}</dd>
          </div>
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="space-y-2">
              <dt className="text-muted-foreground">
                {t("detail.attachments", { count: ticket.attachments.length })}
              </dt>
              <dd className="flex flex-col items-end gap-1">
                {ticket.attachments.map((file, i) => (
                  <a
                    key={`${file.name}-${i}`}
                    href={file.url ?? "#"}
                    className="text-end text-sm font-medium text-primary hover:underline"
                  >
                    {file.name}
                    {file.sizeLabel ? ` · ${file.sizeLabel}` : ""}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </aside>

      {/* Right — chat */}
      <section className="glass flex h-[70vh] flex-col rounded-2xl lg:h-[calc(100vh-8rem)]">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border p-4">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              {getInitials(ticket.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{ticket.name}</p>
            <p dir="ltr" className="truncate text-xs text-muted-foreground">
              #{ticket.id}
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button variant="ghost" size="icon" className="size-9" aria-label={t("detail.call")}>
              <Phone className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-9" aria-label={t("detail.video")}>
              <Video className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-9" aria-label={t("detail.more")}>
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="min-h-0 flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1",
                  m.author === "me" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.author === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
                <span className="text-[11px] text-muted-foreground">{m.time}</span>
              </div>
            ))}

            {/* Attachment cards from the ticket */}
            {ticket.attachments?.map((file, i) => (
              <div key={`att-${i}`} className="flex items-start">
                <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-background text-primary">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    {file.sizeLabel && (
                      <p className="text-xs text-muted-foreground">{file.sizeLabel}</p>
                    )}
                  </div>
                  <a
                    href={file.url ?? "#"}
                    aria-label={t("detail.download")}
                    className="ms-2 text-muted-foreground hover:text-foreground"
                  >
                    <Download className="size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2 rounded-xl bg-muted/40 p-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={t("detail.composerPlaceholder")}
              className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label={t("form.attachments")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            >
              <Paperclip className="size-4" />
            </button>
            <Button
              type="button"
              size="icon"
              onClick={send}
              disabled={!draft.trim()}
              aria-label={t("detail.send")}
              className="size-9 shrink-0 [background:var(--gradient)] text-white hover:opacity-90"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
