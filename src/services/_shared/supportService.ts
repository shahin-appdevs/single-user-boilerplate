import { apiRequest } from "@/lib/api";
import { sharedEndpoints } from "@/constants/api-endpoints";

export type SupportTicketStatus = "pending" | "open" | "answered" | "closed";

export type SupportAttachment = {
  name: string;
  sizeLabel?: string;
  url?: string;
};

export type SupportTicket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: SupportTicketStatus;
  /** ISO timestamp of the last reply. */
  lastRepliedAt: string;
  message?: string;
  attachments?: SupportAttachment[];
};

export type SupportTicketInput = {
  subject: string;
  message: string;
  attachments?: File[];
};

export const supportService = {
  list: (): Promise<SupportTicket[]> =>
    apiRequest<SupportTicket[]>({ method: "GET", url: sharedEndpoints.supportTickets.list }),

  create: (input: SupportTicketInput): Promise<SupportTicket> =>
    apiRequest<SupportTicket>({ method: "POST", url: sharedEndpoints.supportTickets.create, data: input }),

  detail: (id: string): Promise<SupportTicket> =>
    apiRequest<SupportTicket>({ method: "GET", url: sharedEndpoints.supportTickets.detail(id) }),
};
