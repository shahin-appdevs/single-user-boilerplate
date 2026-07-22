export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const personalEndpoints = {
  auth: {
    // `/${role}` suffix appended by authService (user).
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    profile: "/auth/profile",
    setPin: "/auth/set-pin", // kept for future PIN-based flows

    kyc: "/auth/kyc",
    skipKyc: "/auth/kyc/skip",
    me: "/auth/me",
  },
  wallet: {
    balance: "/wallet/balance",
  },
  transactions: {
    list: "/transactions",
    detail: (id: string) => `/transactions/${id}`,
  },
  recipients: {
    list: "/recipients",
    create: "/recipients",
    update: (id: string) => `/recipients/${id}`,
    remove: (id: string) => `/recipients/${id}`,
    transactionTypes: "/recipients/transaction-types",
    fields: (type: string) => `/recipients/fields/${type}`,
  },
} as const;


export const sharedEndpoints = {
  supportTickets: {
    list: "/support-tickets",
    create: "/support-tickets",
    detail: (id: string) => `/support-tickets/${id}`,
  },
} as const;


