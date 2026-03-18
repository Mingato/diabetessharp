import type { Request, Response, NextFunction } from "express";
import { authenticateRequest } from "../hwsAuthSdk.js";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof authenticateRequest>>;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authenticateRequest(req);
    (req as Request).user = user;
  } catch {
    // Unauthenticated — user stays undefined
  }
  next();
}
