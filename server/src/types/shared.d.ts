declare module "shared" {
  export type CarpandaLinkKey = string;

  export const CARPANDA_LINKS: Record<string, string>;

  // We only need the return type to be a string for our usage here.
  // Arguments are kept as any[] to avoid coupling to the internal lib signature.
  export function buildCarpandaUrl(
    key: CarpandaLinkKey,
    orderId: number,
    email: string,
    firstName: string,
    includeBump?: boolean
  ): string;
}

