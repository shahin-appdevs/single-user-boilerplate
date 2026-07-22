import { apiRequest } from "@/lib/api";
import { personalEndpoints } from "@/constants/api-endpoints";

export type Recipient = {
  id: string;
  name: string;
  country: string; // ISO alpha-2
  zipCode: string;
  email: string;
  avatarUrl?: string;
};

export type RecipientInput = Omit<Recipient, "id" | "avatarUrl">;

export type FieldType = "text" | "tel" | "email" | "select";

export type FieldOption = { value: string; label: string };

export type RecipientField = {
  name: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[];
};

export type TransactionType = { value: string; label: string };

export const recipientService = {
  list: (): Promise<Recipient[]> =>
    apiRequest<Recipient[]>({ method: "GET", url: personalEndpoints.recipients.list }),

  create: (input: RecipientInput): Promise<Recipient> =>
    apiRequest<Recipient>({ method: "POST", url: personalEndpoints.recipients.create, data: input }),

  update: (id: string, input: RecipientInput): Promise<Recipient> =>
    apiRequest<Recipient>({ method: "PUT", url: personalEndpoints.recipients.update(id), data: input }),

  remove: (id: string): Promise<{ ok: true }> =>
    apiRequest<{ ok: true }>({ method: "DELETE", url: personalEndpoints.recipients.remove(id) }),

  transactionTypes: (): Promise<TransactionType[]> =>
    apiRequest<TransactionType[]>({ method: "GET", url: personalEndpoints.recipients.transactionTypes }),

  fields: (type: string): Promise<RecipientField[]> =>
    apiRequest<RecipientField[]>({ method: "GET", url: personalEndpoints.recipients.fields(type) }),
};
