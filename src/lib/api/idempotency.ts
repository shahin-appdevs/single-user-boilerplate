/**
 * Request-deduping key generator.
 *
 * Attach via per-request config:
 *   apiClient.post(url, body, { headers: { [IDEMPOTENCY_HEADER]: newIdempotencyKey() } })
 *
 * Money mutations MUST set this; reads MUST NOT.
 */

export const IDEMPOTENCY_HEADER = "Idempotency-Key";

const uuidv4Fallback = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Per RFC 4122 §4.4: set version (4) and variant bits.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
};

export const newIdempotencyKey = (): string => {
  const uuid =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : uuidv4Fallback();
  return `idem_${uuid}`;
};
