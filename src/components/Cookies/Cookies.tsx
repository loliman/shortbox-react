import React from "react";
import SnackbarContent from "@mui/material/SnackbarContent";
import Button from "@mui/material/Button";
import { withContext } from "../generic";

const COOKIE_NAME = "cookiesAccepted";
const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
};

export function hasCookieConsent(value: unknown): boolean {
  return value === true || value === false || value === "true" || value === "false";
}

export function acceptCookies(
  cookies: { set: (name: string, value: string, options: typeof COOKIE_OPTIONS) => void },
  onDone?: () => void
) {
  cookies.set(COOKIE_NAME, "true", COOKIE_OPTIONS);
  onDone?.();
}

export function declineCookies(
  cookies: { set: (name: string, value: string, options: typeof COOKIE_OPTIONS) => void },
  onDone?: () => void
) {
  cookies.set(COOKIE_NAME, "false", COOKIE_OPTIONS);
  onDone?.();
}

export function CookiesBanner(props) {
  const [dismissed, setDismissed] = React.useState(false);
  const accepted = props.cookies.get(COOKIE_NAME);

  if (dismissed || hasCookieConsent(accepted)) return null;

  return (
    <SnackbarContent
      sx={{ width: "100%" }}
      message={
        <span>
          Shortbox verwendet Cookies von Google Analytics um die Leistung der Seite zu analysieren.
          Nähere Informationen dazu und zu Ihren Rechten als Nutzer von Shortbox finden Sie in
          unserer{" "}
          <u>
            <span onMouseDown={(e) => props.navigate(e, "/privacy")}>
              Datenschutzerklärung
            </span>
          </u>{" "}
          am Ende der Seite.
        </span>
      }
      action={[
        <Button
          key={"cookieHintAccepted"}
          variant={"contained"}
          onClick={() => acceptCookies(props.cookies, () => setDismissed(true))}
        >
          Einverstanden
        </Button>,
        <Button
          key={"cookieHintDeclined"}
          variant={"contained"}
          href={"https://www.google.com"}
          onClick={() => declineCookies(props.cookies, () => setDismissed(true))}
        >
          Nicht einverstanden
        </Button>,
      ]}
    />
  );
}
export default withContext(CookiesBanner);
