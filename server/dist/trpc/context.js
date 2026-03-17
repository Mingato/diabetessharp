export function createContext(opts) {
    const { req } = opts;
    const user = req.user ?? null;
    return { req, user };
}
