import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export interface Context {
  req: Request;
  res: Response;
  user: AuthUser | null;
}

export function createContext(opts: CreateExpressContextOptions): Context {
  const { req, res } = opts;
  const user = (req as Request & { user?: AuthUser }).user ?? null;
  return { req, res, user };
}

export type AppContext = Context;
