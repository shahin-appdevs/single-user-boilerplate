declare module "qrcode" {
  export interface QrToDataUrlOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    color?: { dark?: string; light?: string };
  }
  export function toDataURL(
    text: string,
    options?: QrToDataUrlOptions,
  ): Promise<string>;
  const _default: { toDataURL: typeof toDataURL };
  export default _default;
}
