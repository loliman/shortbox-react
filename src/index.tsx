import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import App from "./components/App";
import { ApolloProvider } from "@apollo/client/react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import Button from "@mui/material/Button";
import { onError } from "@apollo/client/link/error";
import { createApolloMockLink } from "./mock/apolloMockLink";
import { isMockMode } from "./app/mockMode";
import { notifySessionInvalid } from "./app/authEvents";

const apiUri =
  import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "https://api.shortbox.de";

const resolveCredentials = (): RequestCredentials => {
  const configured = String(import.meta.env.VITE_API_CREDENTIALS || "").toLowerCase();
  if (configured === "include" || configured === "omit" || configured === "same-origin") {
    return configured;
  }
  return "include";
};

const httpLink = new HttpLink({
  uri: apiUri,
  credentials: resolveCredentials(),
});

const authErrorLink = onError(({ graphQLErrors, operation }) => {
  if (!graphQLErrors || graphQLErrors.length === 0) return;
  const unauthenticated = graphQLErrors.some(
    (error) => String(error.extensions?.code || "") === "UNAUTHENTICATED"
  );

  if (!unauthenticated) return;
  if (operation.operationName === "Login") return;
  notifySessionInvalid();
});

const mockDelayMs = Number(import.meta.env.VITE_MOCK_DELAY_MS || 120);

const client = new ApolloClient({
  link: isMockMode
    ? createApolloMockLink(mockDelayMs)
    : ApolloLink.from([authErrorLink, httpLink]),
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SnackbarProvider
        maxSnack={3}
        action={[
          <Button key="hide" color="primary" size="small" sx={{ color: "white" }}>
            Verbergen
          </Button>,
        ]}
      >
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
}
