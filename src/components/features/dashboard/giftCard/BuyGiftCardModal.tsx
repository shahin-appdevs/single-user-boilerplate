"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/constants/countries";
import { WALLETS } from "../payOut/shared";
import { PhoneInput } from "../mobileTopUp/PhoneInput";
import { BRAND_STYLE, type CatalogCard } from "./catalog";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground md:text-sm">{children}</p>;
}

export function BuyGiftCardModal({
  card,
  open,
  onOpenChange,
}: {
  card: CatalogCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("gift.buy");

  const [amount, setAmount] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("BD");
  const [phone, setPhone] = useState("");
  const [fromName, setFromName] = useState("");
  const [qty, setQty] = useState("1");
  const [walletCode, setWalletCode] = useState(WALLETS[0].code);

  if (!card) return null;

  const style = BRAND_STYLE[card.brand];
  const wallet = WALLETS.find((w) => w.code === walletCode) ?? WALLETS[0];
  const inputCls = "h-11 border-0 bg-muted/40";
  const selectCls = "h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm";

  function buy() {
    if (amount === null) { toast.error(t("validation.amount")); return; }
    if (!email.trim()) { toast.error(t("validation.email")); return; }
    if (!phone.trim()) { toast.error(t("validation.phone")); return; }
    if (!fromName.trim()) { toast.error(t("validation.fromName")); return; }
    // TODO: replace with the buy-gift-card API mutation.
    toast.success(t("success"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-[200px_1fr]">
          {/* Card image */}
          <div className={cn("hidden aspect-3/4 items-center justify-center rounded-xl md:flex", style.bg)}>
            <span className={cn("text-2xl font-extrabold tracking-tight", style.logoClass)}>{style.logo}</span>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <FieldLabel>{t("amount")}</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {card.denominations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setAmount(d)}
                    className={cn(
                      "h-11 rounded-lg text-sm font-semibold transition-colors",
                      amount === d ? "bg-foreground text-background" : "bg-muted/40 text-foreground hover:bg-muted",
                    )}
                  >
                    {d} {card.currency}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("receiverEmail")}</FieldLabel>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" placeholder={t("emailPlaceholder")} className={inputCls} />
              </div>
              <div>
                <FieldLabel>{t("country")}</FieldLabel>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className={selectCls}><SelectValue placeholder={t("selectCountry")} /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">{c.flag} {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FieldLabel>{t("phone")}</FieldLabel>
                <PhoneInput country={phoneCountry} onCountryChange={setPhoneCountry} value={phone} onChange={setPhone} placeholder={t("phonePlaceholder")} />
              </div>
              <div>
                <FieldLabel>{t("fromName")}</FieldLabel>
                <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder={t("fromNamePlaceholder")} className={inputCls} />
              </div>

              <div>
                <FieldLabel>{t("quantity")}</FieldLabel>
                <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={inputCls} />
              </div>
              <div>
                <FieldLabel>{t("wallet")}</FieldLabel>
                <Select value={walletCode} onValueChange={setWalletCode}>
                  <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WALLETS.map((w) => (
                      <SelectItem key={w.code} value={w.code} className="ps-3 py-2.5">{w.name} ({w.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-end text-xs text-muted-foreground" dir="ltr">
                  {t("availableBalance")}: {wallet.symbol}{wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={buy}
              className="h-12 w-full [background:var(--gradient)] text-white hover:opacity-90"
            >
              {t("buyNow")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
