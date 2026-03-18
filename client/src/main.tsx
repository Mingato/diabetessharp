import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@server/routers/index.js";
import App from "./App";
import { refreshAccessToken } from "./lib/tokenRefresh";
import { getLoginUrl } from "./const";
import "./index.css";

let isRedirectingToLogin = false;
let isHandlingUnauthorized = false;
let queryClientInstance: QueryClient | null = null;

function handleUnauthorizedError(error: Error) {
  if (isRedirectingToLogin || isHandlingUnauthorized) return;
  if (!(error instanceof TRPCClientError)) return;
  if (error.data?.code !== "UNAUTHORIZED") return;

  isHandlingUnauthorized = true;

  refreshAccessToken().then((success) => {
    isHandlingUnauthorized = false;

    if (success && queryClientInstance) {
      queryClientInstance.invalidateQueries();
    } else {
      isRedirectingToLogin = true;
      window.location.href = getLoginUrl();
    }
  });
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleUnauthorizedError,
  }),
  mutationCache: new MutationCache({
    onError: handleUnauthorizedError,
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
queryClientInstance = queryClient;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.VITE_API_URL ?? "http://localhost:4000";
}

const trpc = createTRPCReact<AppRouter>();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      fetch(input, init) {
        return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
