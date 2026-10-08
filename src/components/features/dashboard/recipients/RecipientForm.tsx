"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RecipientField } from "@/services/dashboard/recipientService";
import { TRANSACTION_TYPES, buildFields } from "./recipientFields";

type Mode = "add" | "edit";

interface RecipientFormProps {
  mode: Mode;
  initialType?: string;
  initialValues?: Record<string, string>;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-xs tracking-wide text-muted-foreground md:text-sm">
      {children}
      {required && <span className="text-destructive"> *</span>}
    </p>
  );
}

export function RecipientForm({ mode, initialType, initialValues }: RecipientFormProps) {
  const t = useTranslations("recipients");
  const router = useRouter();

  const [txType, setTxType] = useState(initialType ?? TRANSACTION_TYPES[0].value);
  const fields = useMemo(() => buildFields(txType), [txType]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({ mode: "onChange", defaultValues: initialValues ?? {} });

  const inputCls =
    "flex h-11 w-full rounded-lg bg-muted/40 px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50";

  const submit = handleSubmit((values) => {
    void { transactionType: txType, ...values };
    toast.success(mode === "edit" ? t("toast.updated") : t("toast.added"));
    if (mode === "add") reset();
    router.push("/user/recipients");
  });

  function renderField(f: RecipientField) {
    const err = errors[f.name];
    const rules = f.required ? { required: t("validation.fieldRequired", { label: f.label }) } : {};

    return (
      <div key={f.name} className="space-y-2">
        <FieldLabel required={f.required}>{f.label}</FieldLabel>

        {f.type === "select" ? (
          <>
            <input type="hidden" {...register(f.name, rules)} />
            <Select
              value={watch(f.name) ?? ""}
              onValueChange={(v) => setValue(f.name, v, { shouldValidate: true })}
            >
              <SelectTrigger className={cn("h-11! w-full border-0 bg-muted/40 px-3 text-sm", err && "ring-2 ring-destructive")}>
                <SelectValue placeholder={f.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {f.options?.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="ps-3 py-2.5">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : f.type === "tel" ? (
          <div
            dir="ltr"
            className={cn(
              "flex h-11 items-center overflow-hidden rounded-lg bg-muted/40 focus-within:ring-3 focus-within:ring-ring/50",
              err && "ring-2 ring-destructive",
            )}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground">
              +
            </span>
            <input
              {...register(f.name, rules)}
              type="tel"
              placeholder={f.placeholder}
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        ) : (
          <input
            {...register(f.name, rules)}
            type={f.type === "email" ? "email" : "text"}
            dir={f.type === "email" ? "ltr" : undefined}
            placeholder={f.placeholder}
            className={cn(inputCls, err && "ring-2 ring-destructive")}
          />
        )}

        {err && <p className="text-xs text-destructive">{String(err.message)}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2"
          onClick={() => router.push("/user/recipients")}
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t("back")}
        </Button>
      </div>

      <form onSubmit={submit} className="glass rounded-2xl p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <UserPlus className="size-4 text-primary-foreground" />
          </span>
          <p className="text-base font-bold">{mode === "edit" ? t("editTitle") : t("addTitle")}</p>
        </div>

        {/* Transaction type */}
        <div className="mb-4 space-y-2">
          <FieldLabel required>{t("transactionType")}</FieldLabel>
          <Select value={txType} onValueChange={setTxType}>
            <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-sm">
              <SelectValue placeholder={t("selectTransactionType")} />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((x) => (
                <SelectItem key={x.value} value={x.value} className="ps-3 py-2.5">
                  {x.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map(renderField)}
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90"
        >
          {mode === "edit" ? t("save") : t("addNew")}
          <Plus className="ms-2 size-4" />
        </Button>
      </form>
    </div>
  );
}
