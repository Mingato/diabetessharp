import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../server/routers";

export const adminTrpc = createTRPCReact<AppRouter>();

export function createAdminTrpcClient(token: string | null) {
  return adminTrpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        transformer: superjson,
        headers: () => ({
          ...(token ? { "x-admin-token": token } : {}),
        }),
      }),
    ],
  });
}
