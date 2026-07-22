// Dummy field schema. Replace with `recipientService.fields(type)` once the API
// is wired — shape matches RecipientField[] from the service.

import { COUNTRIES } from "@/constants/countries";
import type { Recipient, RecipientField, TransactionType } from "@/services/dashboard/recipientService";

// Dummy recipient rows shared by the list and edit views until the API is wired.
export const SEED_RECIPIENTS: Recipient[] = [
  { id: "1", name: "Appdevs SQA",     country: "IN", zipCode: "3500",  email: "ou8qyq6hd5@wnbaldwy.com" },
  { id: "2", name: "Zedekia Wamboka", country: "KE", zipCode: "50200", email: "topictvke@gmail.com" },
];

export const TRANSACTION_TYPES: TransactionType[] = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "qrpay-wallet",  label: "QRPay Pro Wallet" },
  { value: "cash-pickup",   label: "Cash Pickup" },
];

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

const BANK_OPTIONS = [
  { value: "boa",        label: "Bank of America" },
  { value: "chase",      label: "Chase" },
  { value: "hsbc",       label: "HSBC" },
  { value: "citi",       label: "Citibank" },
  { value: "wells",      label: "Wells Fargo" },
];

const PICKUP_OPTIONS = [
  { value: "agent-1", label: "Downtown Agent" },
  { value: "agent-2", label: "Airport Kiosk" },
  { value: "agent-3", label: "Central Mall Booth" },
];

const COMMON: RecipientField[] = [
  { name: "firstName", label: "First Name",    placeholder: "First Name",          type: "text" },
  { name: "lastName",  label: "Last Name",     placeholder: "Last Name",           type: "text" },
  { name: "country",   label: "Country",       placeholder: "Select Country",      type: "select", required: true, options: COUNTRY_OPTIONS },
  { name: "address",   label: "Address",       placeholder: "Enter Address",       type: "text" },
  { name: "state",     label: "State",         placeholder: "Enter State",         type: "text" },
  { name: "city",      label: "City",          placeholder: "Enter City",          type: "text" },
  { name: "zipCode",   label: "Zip Code",      placeholder: "Zip Code",            type: "text" },
  { name: "phone",     label: "Phone Number",  placeholder: "Enter Mobile Number", type: "tel",   required: true },
  { name: "email",     label: "Email Address", placeholder: "Enter Email Address", type: "email", required: true },
];

const BY_TYPE: Record<string, RecipientField[]> = {
  "bank-transfer": [
    { name: "bank",          label: "Select Bank",    placeholder: "Select Bank Name",     type: "select", required: true, options: BANK_OPTIONS },
    { name: "accountNumber", label: "Account Number", placeholder: "Enter Account Number", type: "text",   required: true },
  ],
  "qrpay-wallet": [
    { name: "walletId", label: "QRPay ID", placeholder: "Enter QRPay ID", type: "text", required: true },
  ],
  "cash-pickup": [
    { name: "pickupLocation", label: "Pickup Location", placeholder: "Select Pickup Point", type: "select", required: true, options: PICKUP_OPTIONS },
  ],
};

/** Dummy resolver — swap for the API call when ready. */
export function buildFields(type: string): RecipientField[] {
  return [...COMMON, ...(BY_TYPE[type] ?? [])];
}
