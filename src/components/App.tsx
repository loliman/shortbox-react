import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Suspense, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import AppContextProvider from "./generic/AppContext";
import { AppRoutes } from "../app/AppRoutes";
import { appTheme } from "../app/theme";
import { type SessionData } from "../app/session";
import { isMockMode } from "../app/mockMode";
import { subscribeSessionInvalid } from "../app/authEvents";
import { me } from "../graphql/queriesTyped";
import { AppPageLoader } from "./generic/loading";

export default function App() {
  const client = useApolloClient();
  const [session, setSession] = useState<SessionData | null>(null);
  const loggedIn = Boolean(session?.loggedIn);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (isMockMode) {
      setSession({ loggedIn: true });
      setAuthReady(true);
      return;
    }

    let mounted = true;

    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then(({ data }) => {
        if (!mounted) return;

        if (data?.me) {
          if (!loggedIn) setSession({ loggedIn: true });
        } else {
          setSession(null);
        }

        setAuthReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setAuthReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [client, loggedIn]);

  useEffect(() => {
    return subscribeSessionInvalid(() => {
      setSession(null);
      setAuthReady(true);
      client.clearStore();
    });
  }, [client]);

  return (
    <ThemeProvider theme={appTheme}>
      <AppContextProvider session={session} setSession={setSession}>
        <CssBaseline />
        <Suspense fallback={<AppPageLoader />}>
          <AppRoutes session={session || undefined} authReady={authReady} />
        </Suspense>
      </AppContextProvider>
    </ThemeProvider>
  );
}
