export function createContext(opts) {
    const { req, res } = opts;
    const user = req.user ?? null;
    return { req, res, user };
}
