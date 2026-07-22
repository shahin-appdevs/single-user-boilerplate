"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ArrowLeft,
  CreditCard,
  ImagePlus,
  Link2,
  Monitor,
  QrCode,
  Smartphone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { createPayLinkSchema } from "@/lib/validators/paymentLink";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { KycDropzone } from "@/components/features/auth/KycDropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─── Types & data ───────────────────────────────────────────────────────── */

type LinkType = "customer" | "fixed";
type Device = "desktop" | "mobile";

const CURRENCIES = [
  { code: "USD", name: "US Dollar",        symbol: "$"  },
  { code: "EUR", name: "Euro",             symbol: "€"  },
  { code: "GBP", name: "British Pound",    symbol: "£"  },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳"  },
  { code: "AED", name: "UAE Dirham",       symbol: "د.إ" },
] as const;

/* ─── Field label ────────────────────────────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground md:text-sm">
      {children}
    </p>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CreatePaymentLinkPage() {
  const t = useTranslations("payLink");
  const tv = useTranslations("payLink.validation");
  const router = useRouter();

  const [type, setType] = useState<LinkType>("customer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currency, setCurrency] = useState("");
  const [setLimits, setSetLimits] = useState(true);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");

  const [device, setDevice] = useState<Device>("desktop");
  const [previewAmount, setPreviewAmount] = useState("");

  const cur = CURRENCIES.find((c) => c.code === currency);
  const symbol = cur?.symbol ?? "$";
  const code = cur?.code ?? "USD";

  const rangeLabel =
    type === "fixed"
      ? `${Number(fixedAmount) || 0} ${code}`
      : `${Number(minAmount) || 0} ${code} – ${Number(maxAmount) || 0} ${code}`;

  function onCreate() {
    const schema = createPayLinkSchema(tv);
    const parsed = schema.safeParse({
      type, title, description, currency, setLimits, minAmount, maxAmount, fixedAmount,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? tv("titleRequired"));
      return;
    }
    // TODO: replace with the create-payment-link API mutation.
    toast.success(t("created"));
    router.push("/user/dashboard/payment-link");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          aria-label={t("back")}
          onClick={() => router.push("/user/dashboard/payment-link")}
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Button>
        <DashboardPageHeader title={t("createHeading")} subtitle={t("subtitle")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ─── Left: builder ─── */}
        <div className="glass rounded-2xl p-5">
          <p className="mb-4 text-base font-bold">{t("selectType")}</p>

          <Select value={type} onValueChange={(v) => setType(v as LinkType)}>
            <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer" className="ps-3 py-2.5">{t("typeCustomer")}</SelectItem>
              <SelectItem value="fixed" className="ps-3 py-2.5">{t("typeFixed")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-6 mb-4 flex items-center gap-3">
            <span className="text-sm font-semibold">{t("paymentPage")}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Title */}
              <div>
                <FieldLabel>{t("fieldTitle")}</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("titlePlaceholder")}
                  className="h-11 border-0 bg-muted/40"
                />
                <div className="mt-4">
                  <FieldLabel>{t("description")}</FieldLabel>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                    className="w-full resize-none rounded-lg bg-muted/40 px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 md:text-sm"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <FieldLabel>{t("image")}</FieldLabel>
                <KycDropzone
                  label={t("dropLabel")}
                  hint={t("dropHint")}
                  icon={ImagePlus}
                  value={image}
                  onSelect={setImage}
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <FieldLabel>{t("currency")}</FieldLabel>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">
                      {c.symbol} {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fixed amount OR customer limits */}
            {type === "fixed" ? (
              <div>
                <FieldLabel>{t("amount")}</FieldLabel>
                <div className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors focus-within:ring-3 focus-within:ring-ring/50">
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">{symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(e.target.value)}
                    placeholder="0.00"
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold tabular-nums outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            ) : (
              <>
                <label className="flex w-fit cursor-pointer items-center gap-2">
                  <Checkbox checked={setLimits} onCheckedChange={(v) => setSetLimits(v === true)} />
                  <span className="text-sm font-medium text-primary">{t("setLimits")}</span>
                </label>

                {setLimits && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel>{t("minAmount")}</FieldLabel>
                      <div className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 focus-within:ring-3 focus-within:ring-ring/50">
                        <span className="shrink-0 text-sm font-semibold text-muted-foreground">{symbol}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={minAmount}
                          onChange={(e) => setMinAmount(e.target.value)}
                          placeholder="0.30"
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold tabular-nums outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>{t("maxAmount")}</FieldLabel>
                      <div className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 focus-within:ring-3 focus-within:ring-ring/50">
                        <span className="shrink-0 text-sm font-semibold text-muted-foreground">{symbol}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={maxAmount}
                          onChange={(e) => setMaxAmount(e.target.value)}
                          placeholder="10,000"
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold tabular-nums outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              size="lg"
              onClick={onCreate}
              className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90"
            >
              <Link2 className="me-2 size-4" />
              {t("createLink")}
            </Button>
          </div>
        </div>

        {/* ─── Right: preview ─── */}
        <div className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-base font-bold">{t("preview")}</p>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {([
                { key: "mobile" as const, icon: Smartphone },
                { key: "desktop" as const, icon: Monitor },
              ]).map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDevice(key)}
                  aria-pressed={device === key}
                  aria-label={t(key === "mobile" ? "deviceMobile" : "deviceDesktop")}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    device === key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Checkout card */}
          <div
            className={cn(
              "mx-auto rounded-2xl border border-hairline bg-surface p-5 transition-all",
              device === "mobile" ? "max-w-sm" : "max-w-full",
            )}
          >
            <div
              className={cn(
                "grid gap-6",
                device === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
              )}
            >
              {/* Left of checkout: amount + QR */}
              <div className="space-y-4">
                <div>
                  <FieldLabel>{t("previewAmount")}</FieldLabel>
                  <div className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 focus-within:ring-3 focus-within:ring-ring/50">
                    <span className="shrink-0 text-sm font-semibold text-muted-foreground">{symbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      readOnly={type === "fixed"}
                      value={type === "fixed" ? fixedAmount : previewAmount}
                      onChange={(e) => setPreviewAmount(e.target.value)}
                      placeholder="0.00"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold tabular-nums outline-none placeholder:text-muted-foreground read-only:cursor-default"
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">{rangeLabel}</p>
                </div>

                <div className="flex size-36 items-center justify-center rounded-xl border border-hairline bg-background">
                  <QrCode className="size-24 text-foreground" />
                </div>
              </div>

              {/* Right of checkout: card form */}
              <div className="space-y-3">
                <p className="text-sm font-semibold">{t("payWithCard")}</p>
                <Input placeholder={t("email")} className="h-11 bg-background" />
                <Input placeholder={t("nameOnCard")} className="h-11 bg-background" />
                <div className="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3">
                  <CreditCard className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    placeholder={t("card")}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">MM / YY / CVC</span>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-hairline bg-muted/40 p-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-600">
                    1
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight">{t("saveTitle")}</p>
                    <p className="text-[11px] text-muted-foreground">{t("saveSub")}</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
                >
                  {t("pay")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
