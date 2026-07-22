"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createSupportTicketSchema,
  type SupportTicketFormValues,
} from "@/lib/validators/support";
import type { SupportTicketInput } from "@/services/_shared/supportService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SupportTicketInput) => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const formatSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-wide text-muted-foreground md:text-sm">
      {children}
    </p>
  );
}

const inputCls =
  "flex h-11 w-full rounded-lg bg-muted/40 px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50";

export function NewTicketDialog({ open, onOpenChange, onSubmit }: Props) {
  const t = useTranslations("supportTicket");
  const tv = useTranslations("supportTicket.validation");
  const schema = useMemo(() => createSupportTicketSchema(tv), [tv]);

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportTicketFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { subject: "", message: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ subject: "", message: "" });
      setFiles([]);
      setFileError(null);
    }
  }, [open, reset]);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list);
    const rejected = incoming.find(
      (f) => !ACCEPTED_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES,
    );
    if (rejected) {
      setFileError(
        !ACCEPTED_TYPES.includes(rejected.type)
          ? tv("fileType")
          : tv("fileSize"),
      );
      return;
    }
    setFileError(null);
    setFiles((prev) => [...prev, ...incoming]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const submit = handleSubmit((values) => {
    onSubmit({ ...values, attachments: files });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md gap-5 p-5 sm:p-6 md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {t("addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <FieldLabel>{t("form.subject")}</FieldLabel>
            <input
              {...register("subject")}
              placeholder={t("form.subjectPlaceholder")}
              className={inputCls}
            />
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FieldLabel>{t("form.message")}</FieldLabel>
            <textarea
              {...register("message")}
              rows={4}
              placeholder={t("form.messagePlaceholder")}
              className="w-full rounded-lg bg-muted/40 p-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50"
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FieldLabel>{t("form.attachments")}</FieldLabel>
            <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center transition-colors hover:border-primary">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <Paperclip className="size-5 text-primary" />
              <span className="text-sm font-medium">{t("form.attachmentsCta")}</span>
              <span className="text-xs text-muted-foreground">
                {t("form.attachmentsHint")}
              </span>
            </label>
            {fileError && <p className="text-xs text-destructive">{fileError}</p>}

            {files.length > 0 && (
              <ul className="space-y-1.5">
                {files.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-xs md:text-sm">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatSize(file.size)}
                    </span>
                    <button
                      type="button"
                      aria-label={t("form.removeAttachment")}
                      onClick={() => removeFile(i)}
                      className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
          >
            {t("submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
