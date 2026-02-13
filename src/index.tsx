import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import App from "./components/App";
import { ApolloProvider } from "@apollo/client/react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import Button from "@mui/material/Button";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
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

const CSRF_COOKIE_NAME = String(import.meta.env.VITE_CSRF_COOKIE_NAME || "sb_csrf");
const CSRF_HEADER_NAME = String(import.meta.env.VITE_CSRF_HEADER_NAME || "x-csrf-token").toLowerCase();
const CSRF_ENABLED = String(import.meta.env.VITE_CSRF_ENABLED || "true").toLowerCase() !== "false";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined" || !document.cookie) return null;
  const key = encodeURIComponent(name) + "=";
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(key));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(key.length));
  } catch {
    return entry.slice(key.length);
  }
};

const isMutationOperation = (query: { definitions?: ReadonlyArray<{ kind?: string; operation?: string }> }): boolean => {
  const operationDefinition = query.definitions?.find(
    (definition) => definition.kind === "OperationDefinition"
  );
  return operationDefinition?.operation === "mutation";
};

const authErrorLink = onError(({ graphQLErrors, operation }) => {
  if (!graphQLErrors || graphQLErrors.length === 0) return;
  const unauthenticated = graphQLErrors.some(
    (error) => String(error.extensions?.code || "") === "UNAUTHENTICATED"
  );

  if (!unauthenticated) return;
  if (operation.operationName === "Login") return;
  notifySessionInvalid();
});

const csrfLink = setContext((operation, prevContext) => {
  if (!CSRF_ENABLED) return prevContext;
  if (!isMutationOperation(operation.query)) return prevContext;
  if (operation.operationName === "Login") return prevContext;

  const csrfToken = getCookie(CSRF_COOKIE_NAME);
  if (!csrfToken) return prevContext;

  return {
    ...prevContext,
    headers: {
      ...(prevContext.headers || {}),
      [CSRF_HEADER_NAME]: csrfToken,
    },
  };
});

const mockDelayMs = Number(import.meta.env.VITE_MOCK_DELAY_MS || 120);

const client = new ApolloClient({
  link: isMockMode
    ? createApolloMockLink(mockDelayMs)
    : ApolloLink.from([authErrorLink, csrfLink, httpLink]),
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
