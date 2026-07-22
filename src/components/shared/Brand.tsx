import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type BrandProps = {
  className?: string;
  /** Logo height in px. */
  height?: number;
};

/** QRPay wordmark linking home. Swaps logo per theme via `dark:` visibility. */
export function Brand({ className, height = 30 }: BrandProps) {
  const width = Math.round(height * 4.2);
  return (
    <Link
      href="/"
      aria-label="QRPay Pro"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/images/logo/logo-dark.webp"
        alt="QRPay Pro"
        width={width}
        height={height}
        priority
        style={{ height, width: "auto" }}
        className="dark:hidden"
      />
      <Image
        src="/images/logo/logo-dark.webp"
        alt="QRPay Pro"
        width={width}
        height={height}
        priority
        style={{ height, width: "auto" }}
        className="hidden dark:block"
      />
    </Link>
  );
}
