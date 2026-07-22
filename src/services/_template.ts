// Template service. Not used anywhere — copy-paste base for feature services.
// Delete in a later day if it bothers you.

import { apiRequest } from "@/lib/api";
import { personalEndpoints } from "@/constants/api-endpoints";

export type Example = { id: string; label: string };

export const exampleService = {
  list: () => apiRequest<Example[]>({ method: "GET", url: "/examples" }),
};

// Reference only — keeps `personalEndpoints` import meaningful for copy-paste.
void personalEndpoints;
