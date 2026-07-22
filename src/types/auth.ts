// Shared auth types. Feature days extend as needed.

export type Role = "user";

export type User = {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: Role;
  kycStatus?: "none" | "pending" | "verified" | "rejected";
};

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";
