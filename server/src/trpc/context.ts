import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request } from "express";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export interface Context {
  req: Request;
  user: AuthUser | null;
}

export function createContext(opts: CreateExpressContextOptions): Context {
  const { req } = opts;
  const user = (req as Request & { user?: AuthUser }).user ?? null;
  return { req, user };
}

export type AppContext = Context;
