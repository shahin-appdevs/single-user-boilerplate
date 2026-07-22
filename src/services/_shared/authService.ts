// TODO: replace mocks with axios calls when API ready
// (No mock layer — calls hit the real API via apiRequest. Response shapes
// match the Laravel contract so swapping base URL is the only change.)

import { apiRequest, apiUpload } from "@/lib/api";
import { personalEndpoints } from "@/constants/api-endpoints";
import { getDeviceFingerprint } from "@/lib/security/fingerprint";
import type { Role, User } from "@/types/auth";

export type AuthResponse = { token: string; user: User };

export type LoginInput =
  | {
      role: Role;
      method: "email";
      email: string;
      password: string;
      remember: boolean;
    }
  | {
      role: Role;
      method: "phone";
      phone: string;
      password: string;
      remember: boolean;
    };

// Step 0: register with a single identifier; backend sends the OTP.
export type RegisterInput =
  | { role: Role; method: "phone"; phone: string }
  | { role: Role; method: "email"; email: string };

// Step 2: profile details + password, keyed by the registration id.
export type ProfileInput = {
  registrationId: string;
  fullName: string;
  country: string;
  dateOfBirth: string;
  password: string;
};

const withRole = (base: string, role: Role): string => `${base}/${role}`;

export const authService = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const deviceFingerprint = await getDeviceFingerprint();
    const { role, ...rest } = input;
    return apiRequest<AuthResponse>({
      method: "POST",
      url: withRole(personalEndpoints.auth.login, role),
      data: { ...rest, deviceFingerprint },
      skipAuth: true,
    });
  },

  register: (input: RegisterInput): Promise<{ registrationId: string }> => {
    const { role, ...rest } = input;
    return apiRequest<{ registrationId: string }>({
      method: "POST",
      url: withRole(personalEndpoints.auth.register, role),
      data: rest,
      skipAuth: true,
    });
  },

  verifyOtp: (input: {
    registrationId: string;
    code: string;
  }): Promise<{ ok: true }> =>
    apiRequest<{ ok: true }>({
      method: "POST",
      url: personalEndpoints.auth.verifyOtp,
      data: input,
      skipAuth: true,
    }),

  resendOtp: (input: { registrationId: string }): Promise<{ ok: true }> =>
    apiRequest<{ ok: true }>({
      method: "POST",
      url: personalEndpoints.auth.resendOtp,
      data: input,
      skipAuth: true,
    }),

  setProfile: (input: ProfileInput): Promise<{ ok: true }> =>
    apiRequest<{ ok: true }>({
      method: "POST",
      url: personalEndpoints.auth.profile,
      data: input,
      skipAuth: true,
    }),

  // Kept for future PIN-based flows.
  setPin: (input: {
    registrationId: string;
    pin: string;
  }): Promise<{ ok: true }> =>
    apiRequest<{ ok: true }>({
      method: "POST",
      url: personalEndpoints.auth.setPin,
      data: input,
      skipAuth: true,
    }),

  uploadKyc: (input: {
    registrationId: string;
    nidFront: File;
    nidBack: File;
    selfie: File;
  }): Promise<AuthResponse> => {
    const form = new FormData();
    form.append("registrationId", input.registrationId);
    form.append("nidFront", input.nidFront);
    form.append("nidBack", input.nidBack);
    form.append("selfie", input.selfie);
    return apiUpload<AuthResponse>(personalEndpoints.auth.kyc, form, {
      skipAuth: true,
    });
  },

  skipKyc: (input: { registrationId: string }): Promise<AuthResponse> =>
    apiRequest<AuthResponse>({
      method: "POST",
      url: personalEndpoints.auth.skipKyc,
      data: input,
      skipAuth: true,
    }),
};
