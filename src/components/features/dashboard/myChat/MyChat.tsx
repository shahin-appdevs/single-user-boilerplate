"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type ChatT = ReturnType<typeof useTranslations<"myChat">>;
import { toast } from "sonner";
import {
  ArrowLeft,
  Bold,
  CheckCheck,
  Download,
  FileText,
  Italic,
  List,
  ListOrdered,
  MoreHorizontal,
  Paperclip,
  Pause,
  Phone,
  Play,
  Search,
  Send,
  SmilePlus,
  SquarePen,
  Underline,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/dashboard/initials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  type ChatMessage,
  type Conversation,
} from "./types";

/* ─── Conversation list ──────────────────────────────────────────────────── */

function ConversationList({
  conversations,
  activeId,
  onSelect,
  search,
  onSearch,
  onNewChat,
  t,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  search: string;
  onSearch: (v: string) => void;
  onNewChat: () => void;
  t: ChatT;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 p-3">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-full bg-muted/60 px-3.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={onNewChat}
          aria-label={t("newChat")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <SquarePen className="size-4.5" />
        </button>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full items-start gap-3 border-s-2 border-transparent px-4 py-3 text-start transition-colors hover:bg-muted/50",
                active && "border-primary bg-muted/60",
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="size-11">
                  <AvatarImage src={c.avatarUrl} alt="" />
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {getInitials(c.name)}
                  </AvatarFallback>
                </Avatar>
                {c.online && (
                  <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {c.online ? t("online") : c.status}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="line-clamp-1 text-xs text-muted-foreground">{c.preview}</p>
                  {c.unread > 0 && (
                    <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Message bubble ─────────────────────────────────────────────────────── */

function Bubble({ msg }: { msg: ChatMessage }) {
  const mine = msg.mine;

  return (
    <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm",
          mine
            ? "rounded-ee-md bg-primary/10 text-foreground"
            : "rounded-es-md bg-muted text-foreground",
        )}
      >
        {msg.kind === "file" ? (
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-background text-primary">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{msg.fileName}</p>
              <p className="text-xs text-muted-foreground">{msg.fileSize}</p>
            </div>
            <Download className="size-4 shrink-0 text-muted-foreground" />
          </div>
        ) : msg.kind === "voice" ? (
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Play className="size-4" />
            </span>
            <span className="h-6 w-32 rounded-full bg-[repeating-linear-gradient(90deg,hsl(var(--primary))_0_2px,transparent_2px_5px)] opacity-60" />
            <span className="text-xs tabular-nums text-muted-foreground">01.24</span>
            <Pause className="hidden" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{msg.body}</p>
        )}
      </div>
      <span className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
        {msg.receipt && mine && <CheckCheck className="size-3.5 text-primary" />}
        {msg.receipt ?? msg.time}
      </span>
    </div>
  );
}

/* ─── Composer toolbar ───────────────────────────────────────────────────── */

const TOOLBAR = [Bold, Italic, Underline, List, ListOrdered] as const;

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function MyChatPage() {
  const t = useTranslations("myChat");

  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string>("c2");
  const [draft, setDraft] = useState("");
  const [mobileThread, setMobileThread] = useState(false);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(SEED_MESSAGES);

  const [searchOpen, setSearchOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const conversations = useMemo(
    () =>
      SEED_CONVERSATIONS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const active = SEED_CONVERSATIONS.find((c) => c.id === activeId) ?? SEED_CONVERSATIONS[0];
  const thread = messages[activeId] ?? [];

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileThread(true);
  }

  function send() {
    const body = draft.trim();
    if (!body) return;
    const msg: ChatMessage = { id: `${activeId}-${thread.length + 1}`, body, time: "now", mine: true, receipt: t("sent") };
    setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setDraft("");
  }

  function startChat() {
    if (!phone.trim() && !email.trim()) {
      toast.error(t("searchRequired"));
      return;
    }
    // TODO: replace with the user-search + start-chat API.
    toast.success(t("started"));
    setSearchOpen(false);
    setPhone("");
    setEmail("");
  }

  return (
    <div className="mx-auto max-w-6xl p-4 dapp:p-6">
      <div className="glass grid h-[calc(100dvh-9rem)] grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-[340px_1fr]">
        {/* Conversation list */}
        <div
          className={cn(
            "min-h-0 border-e border-hairline lg:block",
            mobileThread && "hidden",
          )}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={selectConversation}
            search={search}
            onSearch={setSearch}
            onNewChat={() => setSearchOpen(true)}
            t={t}
          />
        </div>

        {/* Thread */}
        <div className={cn("flex min-h-0 flex-col", !mobileThread && "hidden lg:flex")}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileThread(false)}
              aria-label={t("back")}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" />
            </button>
            <Avatar className="size-10">
              <AvatarImage src={active.avatarUrl} alt="" />
              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                {getInitials(active.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{active.name}</p>
              <p className="truncate text-xs text-emerald-600">
                {active.online ? t("online") : active.status}
              </p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              {[Phone, Video, Search, MoreHorizontal].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="scroll-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {thread.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">{t("threadEmpty")}</p>
            ) : (
              thread.map((m) => <Bubble key={m.id} msg={m} />)
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-hairline p-3">
            <div className="rounded-xl bg-muted/50 p-2">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={t("composerPlaceholder")}
                className="max-h-32 min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between gap-2 px-1 pt-1">
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  {TOOLBAR.map((Icon, i) => (
                    <button key={i} type="button" className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground">
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <button type="button" className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground">
                    <SmilePlus className="size-4" />
                  </button>
                  <button type="button" className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground">
                    <Paperclip className="size-4" />
                  </button>
                  <Button
                    size="icon"
                    onClick={send}
                    disabled={!draft.trim()}
                    aria-label={t("send")}
                    className="size-9 [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <Send className="size-4 rtl:rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User search modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t("searchTitle")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("phone")}</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phonePlaceholder")} inputMode="tel" className="h-11" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("email")}</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} inputMode="email" className="h-11" />
            </div>
            <Button
              size="lg"
              onClick={startChat}
              className="h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
            >
              {t("startChat")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
