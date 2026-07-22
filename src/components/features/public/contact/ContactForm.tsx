"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ContactFormLabels = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  namePh: string;
  emailPh: string;
  phonePh: string;
  subjectPh: string;
  messagePh: string;
  submit: string;
  sent: string;
};

export function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        e.currentTarget.reset();
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <Field id="name" label={labels.name} placeholder={labels.namePh} />
      <Field
        id="email"
        type="email"
        label={labels.email}
        placeholder={labels.emailPh}
      />
      <Field id="phone" label={labels.phone} placeholder={labels.phonePh} />
      <Field
        id="subject"
        label={labels.subject}
        placeholder={labels.subjectPh}
      />

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="message">
          {labels.message}
          <span className="text-primary">*</span>
        </Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={labels.messagePh}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      <div className="sm:col-span-2">
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full rounded-full border-0 bg-(image:--gradient) text-white hover:opacity-90"
        >
          {labels.submit}
          <ArrowRight className="rtl:-scale-x-100" />
        </Button>
        {sent ? (
          <p className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-primary">
            <CheckCircle2 className="size-4" /> {labels.sent}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        <span className="text-primary">*</span>
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="h-11 px-3"
      />
    </div>
  );
}
