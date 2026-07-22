export type TxnType = "sent" | "received" | "converted";
export type TxnStatus = "success" | "incomplete" | "failed";

export type TxnCategory =
  | "addMoney"
  | "withdraw"
  | "exchange"
  | "sendMoney"
  | "makePayment"
  | "moneyOut"
  | "requestMoney"
  | "paymentLink"
  | "remittance"
  | "billPay"
  | "mobileTopup"
  | "trade"
  | "marketplace"
  | "virtualCard"
  | "giftCard";

/** Order of the filter tabs (after "All Transactions"). */
export const TXN_CATEGORIES: TxnCategory[] = [
  "addMoney", "withdraw", "exchange", "sendMoney", "makePayment", "moneyOut",
  "requestMoney", "paymentLink", "remittance", "billPay", "mobileTopup",
  "trade", "marketplace", "virtualCard", "giftCard",
];

export type StatementTxn = {
  id: string;
  type: TxnType;
  /** Signed display amount in the primary currency. */
  amount: string;
  /** Optional secondary amount line (e.g. converted value). */
  secondary?: string;
  currency: string;
  method: string;
  methodDetail: string;
  status: TxnStatus;
  activity: string;
  /** Bolded name inside the activity sentence. */
  activityName?: string;
  person: string;
  category: TxnCategory;
  /** ISO timestamp. */
  date: string;
};

// TODO: replace with data from the statement API.
export const SEED_TXNS: StatementTxn[] = [
  { id: "t1",  type: "sent",      amount: "- 500.00 IDR",   secondary: "",        currency: "IDR", method: "Credit Card",   methodDetail: "**** 6989", status: "success",    activity: "Sending money to Raihan Fikri",       activityName: "Raihan Fikri",  person: "Raihan Zuhilmin",  category: "sendMoney",   date: "2023-08-28T15:40:00" },
  { id: "t2",  type: "sent",      amount: "- 200.000 IDR",  secondary: "20 USD",  currency: "IDR", method: "Wire Transfer", methodDetail: "**** 9830", status: "success",    activity: "Sending money to Bani Zuhilmin",      activityName: "Bani Zuhilmin", person: "Bani Zuhilmin",    category: "sendMoney",   date: "2023-08-28T15:40:00" },
  { id: "t3",  type: "received",  amount: "+ 1.500 USD",    secondary: "",        currency: "USD", method: "Bank Transfer", methodDetail: "*** 6663",  status: "success",    activity: "Received money from Andrew",          activityName: "Andrew",        person: "Andrew Top G",     category: "addMoney",    date: "2023-08-28T15:40:00" },
  { id: "t4",  type: "received",  amount: "+ 2.500 USD",    secondary: "",        currency: "USD", method: "PayPal",        methodDetail: "@clarisetaj", status: "success",  activity: "Payment for product",                  person: "Clarista Jawl",    category: "paymentLink", date: "2023-08-28T15:40:00" },
  { id: "t5",  type: "received",  amount: "+ 1.500 USD",    secondary: "",        currency: "USD", method: "Payoneer",      methodDetail: "**** 1083", status: "incomplete", activity: "Payment for invoice",                 person: "Andrew Top G",     category: "paymentLink", date: "2023-08-27T17:30:00" },
  { id: "t6",  type: "converted", amount: "400.000 IDR",    secondary: "40 USD",  currency: "IDR", method: "Debit Card",    methodDetail: "**** 2833", status: "failed",     activity: "Convert money from USD to IDR",       person: "Bagus Fikri",      category: "exchange",    date: "2023-08-27T15:35:00" },
  { id: "t7",  type: "received",  amount: "+ 500 USD",      secondary: "",        currency: "USD", method: "Credit Card",   methodDetail: "**** 3298", status: "success",    activity: "Received money from Bani Zuhilmin",    activityName: "Bani Zuhilmin", person: "Bani Zuhilmin",    category: "requestMoney", date: "2023-08-27T14:15:00" },
  { id: "t8",  type: "received",  amount: "+ 1.000 IDR",    secondary: "",        currency: "IDR", method: "PayPal",        methodDetail: "@basiliovin", status: "success", activity: "Received money from Basilius Kelvin", activityName: "Basilius Kelvin", person: "Basilius Kelvin", category: "addMoney",    date: "2023-08-27T11:10:00" },
  { id: "t9",  type: "sent",      amount: "- 1.500.000 IDR", secondary: "150 USD", currency: "IDR", method: "Wire Transfer", methodDetail: "**** 2334", status: "failed",   activity: "Sending money to Raihan Fikri",       activityName: "Raihan Fikri",  person: "Raihan Zuhilmin",  category: "moneyOut",    date: "2023-08-27T09:40:00" },
];
