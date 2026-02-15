import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { SessionData } from "./session";

type PrivateRouteProps = PropsWithChildren<{
  session?: SessionData;
  authReady?: boolean;
}>;

export function PrivateRoute({ session, authReady = false, children }: PrivateRouteProps) {
  const location = useLocation();
  const hasSession = Boolean(session?.loggedIn);

  if (!authReady) {
    return null;
  }

  if (hasSession) {
    return children;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}
