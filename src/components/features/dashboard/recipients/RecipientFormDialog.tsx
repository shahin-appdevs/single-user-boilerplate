"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { COUNTRIES } from "@/constants/countries";
import { createRecipientSchema, type RecipientFormValues } from "@/lib/validators/recipient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipient, RecipientInput } from "@/services/dashboard/recipientService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: Recipient | null;
  onSubmit: (values: RecipientInput) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs tracking-wide text-muted-foreground md:text-sm">{children}</p>;
}

export function RecipientFormDialog({ open, onOpenChange, recipient, onSubmit }: Props) {
  const t = useTranslations("recipients");
  const tv = useTranslations("recipients.validation");
  const schema = useMemo(() => createRecipientSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecipientFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", country: "", zipCode: "", email: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: recipient?.name ?? "",
        country: recipient?.country ?? "",
        zipCode: recipient?.zipCode ?? "",
        email: recipient?.email ?? "",
      });
    }
  }, [open, recipient, reset]);

  const country = String(watch("country") ?? "");

  const submit = handleSubmit((values) => {
    onSubmit(values as RecipientInput);
    onOpenChange(false);
  });

  const inputCls =
    "flex h-11 w-full rounded-lg bg-muted/40 px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md gap-5 p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {recipient ? t("editTitle") : t("addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <FieldLabel>{t("form.name")}</FieldLabel>
            <input {...register("name")} placeholder={t("form.namePlaceholder")} className={inputCls} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <FieldLabel>{t("form.country")}</FieldLabel>
            <input type="hidden" {...register("country")} />
            <Select value={country} onValueChange={(v) => setValue("country", v, { shouldValidate: true })}>
              <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-sm">
                <SelectValue placeholder={t("form.countryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">
                    <span className="me-2">{c.flag}</span>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
          </div>

          <div className="space-y-2">
            <FieldLabel>{t("form.zip")}</FieldLabel>
            <input
              {...register("zipCode")}
              dir="ltr"
              placeholder={t("form.zipPlaceholder")}
              className={inputCls}
            />
            {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode.message}</p>}
          </div>

          <div className="space-y-2">
            <FieldLabel>{t("form.email")}</FieldLabel>
            <input
              {...register("email")}
              type="email"
              dir="ltr"
              placeholder={t("form.emailPlaceholder")}
              className={inputCls}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
          >
            {recipient ? t("save") : t("add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
