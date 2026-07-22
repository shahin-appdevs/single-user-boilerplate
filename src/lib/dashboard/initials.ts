/** First letters of the first two words, uppercased. Falls back to "U". */
export const getInitials = (name?: string): string =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
