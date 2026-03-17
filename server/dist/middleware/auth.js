import { authenticateRequest } from "../hwsAuthSdk.js";
export async function authMiddleware(req, res, next) {
    try {
        const user = await authenticateRequest(req);
        req.user = user;
    }
    catch {
        // Unauthenticated — user stays undefined
    }
    next();
}
