import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Suspense, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useApolloClient } from "@apollo/client";
import AppContextProvider from "./generic/AppContext";
import { AppRoutes } from "../app/AppRoutes";
import { appTheme } from "../app/theme";
import { getSessionCookieOptions, SESSION_COOKIE_NAME, type SessionCookie } from "../app/session";
import { me } from "../graphql/queriesTyped";

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies([SESSION_COOKIE_NAME]);
  const client = useApolloClient();
  const session = cookies.session as SessionCookie | undefined;
  const loggedIn = Boolean(session?.loggedIn);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then(({ data }) => {
        if (!mounted) return;
        if (data?.me) {
          if (!loggedIn) {
            setCookie(SESSION_COOKIE_NAME, { loggedIn: true }, getSessionCookieOptions());
          }
          return;
        }
        if (loggedIn) {
          removeCookie(SESSION_COOKIE_NAME, { path: "/" });
        }
        setAuthReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [client, loggedIn, removeCookie, setCookie]);

  return (
    <ThemeProvider theme={appTheme}>
      <AppContextProvider>
        <CssBaseline />
        <Suspense fallback={null}>
          <AppRoutes session={session} authReady={authReady} />
        </Suspense>
      </AppContextProvider>
    </ThemeProvider>
  );
}
