import { apiRequest } from "@/lib/api";
import { personalEndpoints } from "@/constants/api-endpoints";
import type { User } from "@/types/auth";

/** Current user's profile, including the pay handle used to receive money. */
export type Profile = User;

/** Pay handle a sender uses to address this account. */
export const payHandle = (profile: Pick<Profile, "email" | "phone">): string =>
  profile.email ?? profile.phone;

export const profileService = {
  getMe: (): Promise<Profile> =>
    apiRequest<Profile>({ method: "GET", url: personalEndpoints.auth.me }),
};
