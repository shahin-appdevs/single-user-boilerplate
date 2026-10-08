"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useLogout } from "@/hooks/user/useLogout";
import { COUNTRIES } from "@/constants/countries";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/features/dashboard/mobileTopUp/PhoneInput";

type Tab = "personal" | "password";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground md:text-sm">{label}</p>
      {children}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 focus-within:ring-3 focus-within:ring-ring/50">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button type="button" onClick={() => setShow((s) => !s)} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="toggle">
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const router = useRouter();
  const { logout } = useLogout();

  const [tab, setTab] = useState<Tab>("personal");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Personal fields
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("User");
  const [country, setCountry] = useState("BD");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("user@appdevs.net");
  const [city, setCity] = useState("Dhaka");
  const [state, setState] = useState("Bangladesh");
  const [zip, setZip] = useState("1230");
  const [address, setAddress] = useState("Dhaka, Bangladesh");

  // Password fields
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const inputCls = "h-11 border-0 bg-muted/40";

  function updateProfile() {
    // TODO: replace with the update-profile API mutation.
    toast.success(t("updated"));
  }

  function changePassword() {
    if (!current || !next) { toast.error(t("pwdRequired")); return; }
    if (next !== confirm) { toast.error(t("pwdMismatch")); return; }
    // TODO: replace with the change-password API mutation.
    toast.success(t("pwdChanged"));
    setCurrent(""); setNext(""); setConfirm("");
  }

  const NAV: { key: Tab; label: string; icon: typeof UserRound }[] = [
    { key: "personal", label: t("nav.personal"), icon: UserRound },
    { key: "password", label: t("nav.password"), icon: Lock },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => setConfirmDelete(true)}>
            {t("deleteAccount")}
          </Button>
          <Button size="sm" className="h-9 [background:var(--gradient)] text-white hover:opacity-90" onClick={() => router.push("/user/setup-pin")}>
            <KeyRound className="me-1.5 size-4" />
            {t("setupPin")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        {/* Left: profile card + nav */}
        <div className="glass h-full space-y-4 rounded-2xl p-5 text-center">
          <div className="relative mx-auto w-fit">
            <Avatar className="size-24">
              <AvatarImage src="" alt="" />
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">TU</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 end-0 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Upload className="size-4" />
              <input type="file" accept="image/*" className="absolute inset-0 cursor-pointer opacity-0" />
            </label>
          </div>
          <div>
            <p className="text-base font-bold">{firstName} {lastName}</p>
            <p className="text-xs text-muted-foreground">{t("registeredBy")}: {email}</p>
          </div>

          <nav className="space-y-1 pt-2 text-start">
            {NAV.map(({ key, label, icon: Icon }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <span aria-hidden className={cn("absolute inset-y-1.5 start-0 w-[3px] rounded-e bg-grad transition-opacity", active ? "opacity-100" : "opacity-0")} />
                  <Icon className="size-5 shrink-0" />
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => void logout()}
              className="group relative flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-5 shrink-0" />
              {t("nav.logout")}
            </button>
          </nav>
        </div>

        {/* Right: active tab */}
        <div className="space-y-4">
          {tab === "personal" ? (
            <>
              <div className="glass rounded-2xl p-5 md:p-6">
                <p className="mb-5 text-base font-bold">{t("personalInfo")}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={t("firstName")}><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} /></Field>
                  <Field label={t("lastName")}><Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} /></Field>

                  <Field label={t("country")}>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent className="max-h-64">
                        {COUNTRIES.map((c) => (<SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">{c.flag} {c.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("phone")}>
                    <PhoneInput country={country} onCountryChange={setCountry} value={phone} onChange={setPhone} placeholder={t("phonePlaceholder")} />
                  </Field>

                  <Field label={t("email")}><Input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" className={inputCls} /></Field>
                  <Field label={t("city")}><Input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} /></Field>

                  <Field label={t("state")}><Input value={state} onChange={(e) => setState(e.target.value)} className={inputCls} /></Field>
                  <Field label={t("zip")}><Input value={zip} onChange={(e) => setZip(e.target.value)} className={inputCls} /></Field>
                </div>

                <div className="mt-4">
                  <Field label={t("address")}><Input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} /></Field>
                </div>

                <Button size="lg" onClick={updateProfile} className="mt-5 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90">
                  {t("update")}
                </Button>
              </div>

              {/* KYC */}
              <div className="glass rounded-2xl p-5">
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-base font-bold">{t("kycTitle")}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                    <ShieldCheck className="size-3" />
                    {t("verified")}
                  </span>
                </div>
                <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm text-emerald-600">{t("kycVerifiedNote")}</div>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-5 md:p-6">
              <p className="mb-5 text-base font-bold">{t("changePassword")}</p>
              <div className="space-y-4">
                <Field label={t("currentPassword")}><PasswordInput value={current} onChange={setCurrent} placeholder={t("passwordPlaceholder")} /></Field>
                <Field label={t("newPassword")}><PasswordInput value={next} onChange={setNext} placeholder={t("passwordPlaceholder")} /></Field>
                <Field label={t("confirmPassword")}><PasswordInput value={confirm} onChange={setConfirm} placeholder={t("passwordPlaceholder")} /></Field>
                <Button size="lg" onClick={changePassword} className="h-12 w-full [background:var(--gradient)] text-white hover:opacity-90">
                  {t("change")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t("deleteTitle")}
        description={t("deleteDesc")}
        confirmLabel={t("deleteAccount")}
        cancelLabel={t("cancel")}
        onConfirm={() => { toast.success(t("deleteRequested")); setConfirmDelete(false); }}
        destructive
      />
    </div>
  );
}
