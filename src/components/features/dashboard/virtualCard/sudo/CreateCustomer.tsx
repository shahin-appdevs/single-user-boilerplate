"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, IdCard, ImagePlus, UserCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { COUNTRIES } from "@/constants/countries";
import { createCustomerSchema, type CustomerFormValues } from "@/lib/validators/customer";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KycDropzone } from "@/components/features/auth/KycDropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const IDENTITY_TYPES = [
  { value: "bvn",      label: "Bank Verification Number" },
  { value: "nid",      label: "National ID"              },
  { value: "passport", label: "Passport"                 },
  { value: "license",  label: "Driving License"          },
] as const;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground md:text-sm">{label}</p>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function CreateCustomerPage() {
  const t = useTranslations("vcard.customer");
  const tv = useTranslations("vcard.customer.validation");
  const router = useRouter();

  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const schema = useMemo(() => createCustomerSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "", lastName: "", dob: "", identityType: IDENTITY_TYPES[0].value,
      identityNumber: "", phone: "", address1: "", address2: "",
      city: "", state: "", country: "BD", postalCode: "",
    },
  });

  const identityType = watch("identityType");
  const country = watch("country");

  const inputCls = "h-11 border-0 bg-muted/40";
  const selectCls = "h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm";

  const onSubmit = handleSubmit((_values) => {
    if (!idFront || !idBack) {
      setFileError(tv("idRequired"));
      toast.error(tv("idRequired"));
      return;
    }
    setFileError(null);
    // TODO: replace with the create-customer API mutation.
    toast.success(t("created"));
    router.push("/user/dashboard/card");
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 dapp:p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="size-9 shrink-0" aria-label={t("back")} onClick={() => router.push("/user/dashboard/card")}>
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Button>
        <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />
      </div>

      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="mb-6 space-y-1 text-center">
          <p className="text-sm font-semibold">{t("reviewNote")}</p>
          <p className="text-sm text-muted-foreground">
            {t("currentStatus")}{" "}
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
              {t("statusActive")}
            </span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <input type="hidden" {...register("identityType")} />
          <input type="hidden" {...register("country")} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={t("firstName")} error={errors.firstName?.message}>
              <Input {...register("firstName")} placeholder={t("firstNamePlaceholder")} className={inputCls} />
            </Field>
            <Field label={t("lastName")} error={errors.lastName?.message}>
              <Input {...register("lastName")} placeholder={t("lastNamePlaceholder")} className={inputCls} />
            </Field>

            <Field label={t("dob")} error={errors.dob?.message}>
              <Input type="date" {...register("dob")} className={inputCls} />
            </Field>
            <Field label={t("identityType")} error={errors.identityType?.message}>
              <Select value={identityType} onValueChange={(v) => setValue("identityType", v, { shouldValidate: true })}>
                <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {IDENTITY_TYPES.map((i) => (
                    <SelectItem key={i.value} value={i.value} className="ps-3 py-2.5">{i.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t("identityNumber")} error={errors.identityNumber?.message}>
              <Input {...register("identityNumber")} placeholder="1233456789" className={inputCls} />
            </Field>
            <Field label={t("phone")} error={errors.phone?.message}>
              <Input {...register("phone")} inputMode="tel" placeholder="880123456789" className={inputCls} />
            </Field>

            <Field label={t("address1")} error={errors.address1?.message}>
              <Input {...register("address1")} placeholder={t("address1Placeholder")} className={inputCls} />
            </Field>
            <Field label={t("address2")}>
              <Input {...register("address2")} placeholder={t("address2Placeholder")} className={inputCls} />
            </Field>

            <Field label={t("city")} error={errors.city?.message}>
              <Input {...register("city")} placeholder={t("cityPlaceholder")} className={inputCls} />
            </Field>
            <Field label={t("state")} error={errors.state?.message}>
              <Input {...register("state")} placeholder={t("statePlaceholder")} className={inputCls} />
            </Field>

            <Field label={t("country")} error={errors.country?.message}>
              <Select value={country} onValueChange={(v) => setValue("country", v, { shouldValidate: true })}>
                <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-64">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("postalCode")} error={errors.postalCode?.message}>
              <Input {...register("postalCode")} placeholder="1230" className={inputCls} />
            </Field>
          </div>

          {/* ID documents */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={t("idFront")}>
              <KycDropzone label={t("dropLabel")} hint={t("dropHint")} icon={IdCard} value={idFront} onSelect={setIdFront} error={fileError && !idFront ? fileError : undefined} />
            </Field>
            <Field label={t("idBack")}>
              <KycDropzone label={t("dropLabel")} hint={t("dropHint")} icon={IdCard} value={idBack} onSelect={setIdBack} error={fileError && !idBack ? fileError : undefined} />
            </Field>
          </div>

          <Field label={t("addressProof")}>
            <KycDropzone label={t("dropLabel")} hint={t("dropHint")} icon={ImagePlus} value={addressProof} onSelect={setAddressProof} full />
          </Field>

          <Button
            type="submit"
            size="lg"
            className={cn("h-12 w-full [background:var(--gradient)] text-white hover:opacity-90")}
          >
            <UserCheck className="me-2 size-4" />
            {t("update")}
          </Button>
        </form>
      </div>
    </div>
  );
}
