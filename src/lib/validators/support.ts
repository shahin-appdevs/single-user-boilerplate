import { z } from "zod";

type Translate = (key: "subjectRequired" | "messageRequired") => string;

export function createSupportTicketSchema(t: Translate) {
  return z.object({
    subject: z.string().trim().min(1, t("subjectRequired")),
    message: z.string().trim().min(1, t("messageRequired")),
  });
}

export type SupportTicketFormValues = z.infer<
  ReturnType<typeof createSupportTicketSchema>
>;
