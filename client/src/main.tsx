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
let lastRedirectTime = 0;
let lastRefreshSuccessTime = 0;
const REDIRECT_COOLDOWN_MS = 5000;
const REFRESH_RETRY_COOLDOWN_MS = 10000;

function handleUnauthorizedError(error: Error) {
  if (isRedirectingToLogin || isHandlingUnauthorized) return;
  if (!(error instanceof TRPCClientError)) return;
  if (error.data?.code !== "UNAUTHORIZED") return;

  // Evita loop: não redirecionar de novo se já redirecionamos há pouco
  if (Date.now() - lastRedirectTime < REDIRECT_COOLDOWN_MS) return;

  // Evita loop: se refresh já retornou sucesso há pouco e ainda 401, vai direto para login
  const skipRefresh = Date.now() - lastRefreshSuccessTime < REFRESH_RETRY_COOLDOWN_MS;

  isHandlingUnauthorized = true;

  (skipRefresh ? Promise.resolve(false) : refreshAccessToken()).then((success) => {
    isHandlingUnauthorized = false;

    if (success && queryClientInstance) {
      lastRefreshSuccessTime = Date.now();
      queryClientInstance.invalidateQueries();
    } else {
      isRedirectingToLogin = true;
      lastRedirectTime = Date.now();
      const loginUrl = getLoginUrl();
      // Evita loop: se HWS_AUTH_URL aponta para o próprio app, não redirecionar
      try {
        const authOrigin = new URL(loginUrl.split("?")[0]).origin;
        if (authOrigin === window.location.origin) {
          console.error("[Auth] HWS_AUTH_URL está apontando para o próprio app. Configure HWS_AUTH_URL com a URL do serviço de autenticação.");
          return;
        }
      } catch {
        /* ignore */
      }
      window.location.href = loginUrl;
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
