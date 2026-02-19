import Link from "@mui/material/Link";
import { useApolloClient, useMutation } from "@apollo/client";
import { logout } from "../../graphql/mutationsTyped";
import { isMockMode } from "../../app/mockMode";

type FooterAuthLinkProps = {
  loggedIn?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  enqueueSnackbar?: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  handleLogout?: () => void;
};

const authLinkSx = { px: 1, color: "text.secondary" };

export default function FooterAuthLink(props: Readonly<FooterAuthLinkProps>) {
  if (!props.loggedIn) {
    return (
      <Link
        component="button"
        sx={authLinkSx}
        onClick={() => props.navigate?.(null, "/login")}
      >
        Login
      </Link>
    );
  }

  return <LogoutLink {...props} />;
}

function LogoutLink(props: Readonly<FooterAuthLinkProps>) {
  const client = useApolloClient();
  const [runLogout] = useMutation(logout, {
    onCompleted: (data) => {
      if (!data.logout) {
        props.enqueueSnackbar?.("Logout fehlgeschlagen", { variant: "error" });
      } else {
        props.enqueueSnackbar?.("Auf Wiedersehen!", { variant: "success" });
        client.resetStore();
        props.handleLogout?.();
      }
    },
    onError: (errors) => {
      const message =
        errors.graphQLErrors && errors.graphQLErrors.length > 0
          ? " [" + errors.graphQLErrors[0].message + "]"
          : "";
      props.enqueueSnackbar?.("Logout fehlgeschlagen" + message, { variant: "error" });
    },
  });

  return (
    <Link
      component="button"
      sx={authLinkSx}
      onClick={() => {
        if (isMockMode) {
          props.enqueueSnackbar?.("Auf Wiedersehen!", { variant: "success" });
          client.resetStore();
          props.handleLogout?.();
          return;
        }

        runLogout();
      }}
    >
      Logout
    </Link>
  );
}
