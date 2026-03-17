import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@server/routers/index";
import App from "./App";
import "./index.css";

const trpc = createTRPCReact<AppRouter>();
const queryClient = new QueryClient();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.VITE_API_URL ?? "http://localhost:4000";
}

function trpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
        headers: () => {
          const token = localStorage.getItem("neurosharp_token");
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient()} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
