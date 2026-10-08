"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/i18n/navigation";
import { getInitials } from "@/lib/dashboard/initials";
import { useAuthStore } from "@/store/authStore";

export function NotificationsPopover({ className }: { className?: string }) {
  const t = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  const items = [
    {
      id: "redeem",
      title: t("notificationsPopover.sample.redeemTitle"),
      description: t("notificationsPopover.sample.redeemDesc"),
      time: t("notificationsPopover.sample.redeemTime"),
    },
    {
      id: "request",
      title: t("notificationsPopover.sample.requestTitle"),
      description: t("notificationsPopover.sample.requestDesc"),
      time: t("notificationsPopover.sample.requestTime"),
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("topbar.notifications")}
          className={cn("relative", className)}
        >
          <Bell />
          <span
            aria-hidden
            className="absolute end-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-semibold">
            {t("notificationsPopover.title")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label={t("notificationsPopover.close")}
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {items.length ? (
          <ScrollArea className="max-h-72">
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-2.5 px-3 py-2.5 hover:bg-muted/50"
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={user?.avatarUrl} alt="" />
                    <AvatarFallback>
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.title}
                    </p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t("notificationsPopover.empty")}
          </div>
        )}

        <Link
          href="/user/notifications"
          onClick={() => setOpen(false)}
          className="block px-3 py-2 text-center text-sm font-medium text-primary hover:underline"
        >
          {t("notificationsPopover.viewAll")}
        </Link>
      </PopoverContent>
    </Popover>
  );
}
