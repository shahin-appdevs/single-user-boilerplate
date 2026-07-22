import { useCallback, useState } from "react";

import type { Role } from "@/types/auth";
import type { IdentifierValues } from "@/lib/validators/auth";

export type KycOutcome = "verified" | "pending";

// 0 Account · 1 Verify · 2 Details · 3 KYC · 4 Done
export type RegisterFlow = {
  step: number;
  registrationId: string | null;
  identifier: IdentifierValues | null;
  kycStatus: KycOutcome | null;
  role: Role;
  back: () => void;
  completeIdentity: (registrationId: string, data: IdentifierValues) => void;
  completeOtp: () => void;
  completeProfile: () => void;
  completeKyc: (outcome: KycOutcome) => void;
};

/**
 * Step state machine for registration. Keeps per-step data so each step
 * component stays dumb (receives data + callbacks, owns no flow logic).
 */
export function useRegisterFlow(role: Role): RegisterFlow {
  const [step, setStep] = useState(0);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<IdentifierValues | null>(null);
  const [kycStatus, setKycStatus] = useState<KycOutcome | null>(null);

  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const completeIdentity = useCallback(
    (id: string, data: IdentifierValues) => {
      setRegistrationId(id);
      setIdentifier(data);
      setStep(1);
    },
    [],
  );

  const completeOtp = useCallback(() => setStep(2), []);
  const completeProfile = useCallback(() => setStep(3), []);
  const completeKyc = useCallback((outcome: KycOutcome) => {
    setKycStatus(outcome);
    setStep(4);
  }, []);

  return {
    step,
    registrationId,
    identifier,
    kycStatus,
    role,
    back,
    completeIdentity,
    completeOtp,
    completeProfile,
    completeKyc,
  };
}
