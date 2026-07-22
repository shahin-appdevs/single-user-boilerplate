"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import {
  clearToken,
  getToken,
  isTokenExpired,
  setToken,
} from "@/lib/auth/token";

// TEMP: Day 4 smoke; remove when auth UI lands (Day 6)
export function ApiSmoke() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() => {
          setToken("header.eyJleHAiOjk5OTk5OTk5OTl9.sig", true);
          console.log(getToken());
        }}
      >
        Set fake token
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setToken("header.eyJleHAiOjF9.sig", true);
          console.log(isTokenExpired(getToken()!));
        }}
      >
        Set expired token
      </Button>
      <Button variant="outline" onClick={() => clearToken()}>
        Clear token
      </Button>
      <Button
        variant="outline"
        onClick={() => apiClient.get("/auth/me").catch((e) => console.log(e))}
      >
        Probe 401
      </Button>
    </div>
  );
}
