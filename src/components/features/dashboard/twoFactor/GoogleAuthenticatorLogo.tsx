/** Inline Google Authenticator mark (rounded square + asterisk star). */
export function GoogleAuthenticatorLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Google Authenticator">
      <rect x="3" y="3" width="42" height="42" rx="11" fill="#1A73E8" />
      <g stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
        <line x1="24" y1="13" x2="24" y2="35" />
        <line x1="14.5" y1="18.5" x2="33.5" y2="29.5" />
        <line x1="14.5" y1="29.5" x2="33.5" y2="18.5" />
      </g>
      <circle cx="24" cy="24" r="3.2" fill="#fff" />
    </svg>
  );
}
