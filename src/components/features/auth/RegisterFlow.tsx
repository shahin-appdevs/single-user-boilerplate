"use client";

import { findCountry } from "@/constants/countries";
import { useAuthStore } from "@/store/authStore";
import { useRegisterFlow } from "@/hooks/_shared/useRegisterFlow";
import { useStepTransition } from "@/hooks/_shared/useStepTransition";
import { RegisterStepper } from "./RegisterStepper";
import { StepIdentity } from "./steps/StepIdentity";
import { StepOtp } from "./steps/StepOtp";
import { StepDetails } from "./steps/StepDetails";
import { StepKyc } from "./steps/StepKyc";
import { StepDone } from "./steps/StepDone";

export function RegisterFlow() {
  const role = useAuthStore((s) => s.role);
  const flow = useRegisterFlow(role);
  const stepRef = useStepTransition<HTMLDivElement>(flow.step);

  const id = flow.identifier;
  const method = id?.method ?? "phone";
  const destination =
    id?.method === "phone"
      ? `${findCountry(id.country).dial}${id.phone.replace(/\D/g, "")}`
      : (id?.email ?? "");

  return (
    <div className="flex flex-col">
      {flow.step < 4 && <RegisterStepper step={flow.step} />}

      <div key={flow.step} ref={stepRef}>
        {flow.step === 0 && <StepIdentity onDone={flow.completeIdentity} />}
          {flow.step === 1 && flow.registrationId && (
            <StepOtp
              registrationId={flow.registrationId}
              destination={destination}
              method={method}
              onVerified={flow.completeOtp}
              onBack={flow.back}
            />
          )}
          {flow.step === 2 && flow.registrationId && (
            <StepDetails
              registrationId={flow.registrationId}
              onDone={flow.completeProfile}
              onBack={flow.back}
            />
          )}
          {flow.step === 3 && flow.registrationId && (
            <StepKyc
              registrationId={flow.registrationId}
              onDone={flow.completeKyc}
              onBack={flow.back}
            />
          )}
          {flow.step === 4 && (
            <StepDone kycStatus={flow.kycStatus ?? "pending"} />
          )}
      </div>
    </div>
  );
}
