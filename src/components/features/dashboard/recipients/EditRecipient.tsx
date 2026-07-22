"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { RecipientForm } from "./RecipientForm";
import { SEED_RECIPIENTS } from "./recipientFields";

function EditRecipientInner() {
  const id = useSearchParams().get("id");
  const recipient = SEED_RECIPIENTS.find((r) => r.id === id);

  const [firstName, ...rest] = (recipient?.name ?? "").split(" ");
  const initialValues = {
    firstName: firstName ?? "",
    lastName: rest.join(" "),
    country: recipient?.country ?? "",
    zipCode: recipient?.zipCode ?? "",
    email: recipient?.email ?? "",
  };

  return <RecipientForm mode="edit" initialValues={initialValues} />;
}

export default function EditRecipientPage() {
  return (
    <Suspense>
      <EditRecipientInner />
    </Suspense>
  );
}
