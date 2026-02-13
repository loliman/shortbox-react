export type SessionData = {
  loggedIn: boolean;
};

export const SESSION_COOKIE_NAME = "session";

export const getSessionCookieOptions = () => ({
  path: "/",
  sameSite: "lax" as const,
  secure: globalThis.window === undefined ? false : globalThis.location.protocol === "https:",
  maxAge: 60 * 60 * 24 * 14,
});
