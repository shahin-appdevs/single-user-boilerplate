import type { SupportTicket } from "@/services/_shared/supportService";

/** Placeholder rows until the support-tickets API is wired. */
export const SEED_TICKETS: SupportTicket[] = [
  {
    id: "ST76671147",
    name: "Test User",
    email: "user@appdevs.net",
    subject: "Test",
    status: "pending",
    lastRepliedAt: "2026-07-01T11:07:00",
    message: "Test Message",
    attachments: [{ name: "rider", sizeLabel: "5.3 Mb" }],
  },
];
