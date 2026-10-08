"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ChevronDown,
  LogOut,
  PlusCircle,
  Send,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";
import { useLogout } from "@/hooks/user/useLogout";
import { getInitials } from "@/lib/dashboard/initials";
import { useAuthStore } from "@/store/authStore";

type MenuLink = { key: string; label: string; href: string; icon: LucideIcon };

export function ProfileMenu() {
  const t = useTranslations("dashboard.profileMenu");
  const td = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const { logout, isPending } = useLogout();

  const name = user?.name ?? "Daniel R.";
  const [open, setOpen] = useState(false);

  const primary: MenuLink[] = [
    { key: "sendMoney", label: t("sendMoney"), href: "/user/money-transfer", icon: Send },
    { key: "addFund", label: t("addFund"), href: "/user/add-money", icon: PlusCircle },
    { key: "withdraw", label: t("withdraw"), href: "/user/withdraw-money", icon: ArrowDownToLine },
  ];

  const secondary: MenuLink[] = [
    { key: "kyc", label: t("kyc"), href: "/user/profile", icon: UserRound },
    { key: "twoFa", label: t("twoFa"), href: "/user/two-factor-auth", icon: ShieldCheck },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("title")}
          className="flex items-center gap-2 rounded-full bg-white py-1 pe-2.5 ps-1 shadow-xs outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring dark:bg-muted/40"
        >
          <Avatar className="size-8">
            <AvatarImage src={user?.avatarUrl} alt="" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-start leading-tight sm:block">
            <span className="block max-w-28 truncate text-xs font-semibold">
              {name}
            </span>
            <span className="block text-[11px] capitalize text-muted-foreground">
              {role ?? "Personal"}
            </span>
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-72 gap-1.5 bg-muted p-1.5 ring-0"
      >
        <div className="flex items-center gap-3 rounded-lg bg-background p-4">
          <Avatar className="size-10">
            <AvatarImage src={user?.avatarUrl} alt="" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p dir="ltr" className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <MenuGroup items={primary} onNavigate={() => setOpen(false)} />
        <MenuGroup items={secondary} onNavigate={() => setOpen(false)} />

        <button
          type="button"
          disabled={isPending}
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg bg-background px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
        >
          <LogOut className="size-4.5 shrink-0" />
          {td("signOut")}
        </button>
      </PopoverContent>
    </Popover>
  );
}

function MenuGroup({
  items,
  onNavigate,
}: {
  items: MenuLink[];
  onNavigate: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-background py-1">
      {items.map(({ key, label, href, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
        >
          <Icon className="size-4.5 shrink-0 text-muted-foreground" />
          {label}
        </Link>
      ))}
    </div>
  );
}
