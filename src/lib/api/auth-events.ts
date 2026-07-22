/**
 * Tiny pub/sub so the axios interceptor can signal logout without importing
 * the auth store (avoids circular deps). The auth store subscribes here (Day 5).
 */

type AuthEvent = "unauthorized";
type Listener = (event: AuthEvent) => void;

const listeners = new Set<Listener>();

export const onAuthEvent = (fn: Listener): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const emitAuthEvent = (event: AuthEvent): void => {
  for (const fn of listeners) {
    try {
      fn(event);
    } catch {
      // Swallow listener errors so one bad listener can't block others.
    }
  }
};

const UNAUTHORIZED_WINDOW_MS = 2000;
let unauthorizedInFlight = false;

/**
 * Returns true only for the first caller within a 2-second window, then
 * auto-resets. Lets concurrent 401s collapse into a single logout.
 */
export const claimUnauthorizedHandling = (): boolean => {
  if (unauthorizedInFlight) return false;
  unauthorizedInFlight = true;
  setTimeout(() => {
    unauthorizedInFlight = false;
  }, UNAUTHORIZED_WINDOW_MS);
  return true;
};
