import Card from "@mui/material/Card";
import React from "react";
import TopBar from "../TopBar";
import List from "../List";
import { withContext } from "../generic";
import AddFab from "../restricted/AddFab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useApolloClient, useMutation } from "@apollo/client";
import { logout } from "../../graphql/mutationsTyped";
import Cookies from "../Cookies";
import { generateUrl } from "../../util/hierarchy";
import type { Cookies as CookiesType } from "react-cookie";
import type { SelectedRoot } from "../../types/domain";

interface SessionData {
  loggedIn: boolean;
}

interface LayoutProps {
  us?: boolean;
  children?: React.ReactNode;
  drawerOpen?: boolean;
  session?: SessionData;
  handleScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  mobile?: boolean;
  mobileLandscape?: boolean;
  tablet?: boolean;
  tabletLandscape?: boolean;
  cookies?: CookiesType;
  selected?: SelectedRoot;
  query?: { filter?: string | null; order?: string | null; direction?: string | null } | null;
  enqueueSnackbar?: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  handleLogout?: () => void;
  [key: string]: unknown;
}

function Layout(props: Readonly<LayoutProps>) {
  const { us, children, session, drawerOpen, mobile, tablet, tabletLandscape } = props;
  const temporaryDrawer = Boolean(mobile || (tablet && !tabletLandscape));
  const drawerWidth = temporaryDrawer ? 320 : 360;
  const contentOffset = !temporaryDrawer && drawerOpen ? `${drawerWidth}px` : 0;
  const newDesignEnabled = props.cookies?.get("newDesign") === "true";

  return (
    <React.Fragment>
      <TopBar />

      <Box>
        <List />

        <Box
          sx={{
            px: 2,
            pb: 2,
            ml: contentOffset,
            transition: (theme) =>
              theme.transitions.create("margin-left", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
          onScroll={(e) => (props.handleScroll ? props.handleScroll(e) : false)}
        >
          <Card sx={{ p: 1 }}>
            <Box sx={{ flexGrow: 1 }}>{children}</Box>

            <Box sx={{ mt: "7px", mb: "7px", display: "flex", flexDirection: "row-reverse" }}>
              <Typography>
                <span
                  style={{ paddingLeft: "10px", paddingRight: "10px", color: "darkgray", cursor: "pointer" }}
                  onMouseDown={(e) => props.navigate?.(e, "/contact")}
                >
                  Kontakt
                  {!props.mobile || props.mobileLandscape ? "/Fehler melden/Unterstützen" : ""}
                </span>
                <span style={{ paddingLeft: "5px", paddingRight: "5px", color: "darkgray" }}>|</span>
                <span
                  style={{ paddingLeft: "10px", paddingRight: "10px", color: "darkgray", cursor: "pointer" }}
                  onMouseDown={(e) => props.navigate?.(e, "/impress")}
                >
                  Impressum
                </span>
                <span style={{ paddingLeft: "5px", paddingRight: "5px", color: "darkgray" }}>|</span>
                <span
                  style={{ paddingLeft: "10px", paddingRight: "10px", color: "darkgray", cursor: "pointer" }}
                  onMouseDown={(e) => props.navigate?.(e, "/privacy")}
                >
                  Datenschutz
                </span>
                <span style={{ paddingLeft: "5px", paddingRight: "5px", color: "darkgray" }}>|</span>
                <span
                  style={{ paddingLeft: "10px", paddingRight: "10px", color: "darkgray", cursor: "pointer" }}
                  onMouseDown={(e) => {
                    if (!props.cookies) return;

                    props.cookies.set("newDesign", newDesignEnabled ? "false" : "true");
                    props.navigate?.(e, generateUrl(props.selected, props.us), {
                      filter: props.query ? props.query.filter : null,
                      order: props.query ? props.query.order : null,
                      direction: props.query ? props.query.direction : null,
                    });
                  }}
                >
                  Zu {newDesignEnabled ? "altem" : "neuem"} Design wechseln
                </span>
                <span style={{ paddingLeft: "5px", paddingRight: "5px", color: "darkgray" }}>|</span>
                {!session?.loggedIn ? <LogIn {...props} /> : <LogOut {...props} />}
              </Typography>
            </Box>
          </Card>
        </Box>

        <Cookies />
        <AddFab us={us} />
      </Box>
    </React.Fragment>
  );
}

function LogIn(props: Pick<LayoutProps, "navigate">) {
  return (
    <span
      style={{ paddingLeft: "10px", paddingRight: "10px", color: "darkgray", cursor: "pointer" }}
      onMouseDown={(e) => props.navigate?.(e, "/login")}
    >
      Login
    </span>
  );
}

function LogOut(props: Pick<LayoutProps, "session" | "enqueueSnackbar" | "handleLogout">) {
  const { session, enqueueSnackbar, handleLogout } = props;
  if (!session?.loggedIn) {
    return null;
  }
  const client = useApolloClient();
  const [runLogout] = useMutation(logout, {
    onCompleted: (data) => {
      if (!data.logout) {
        enqueueSnackbar?.("Logout fehlgeschlagen", { variant: "error" });
      } else {
        enqueueSnackbar?.("Auf Wiedersehen!", { variant: "success" });
        client.resetStore();
        handleLogout?.();
      }
    },
    onError: (errors) => {
      let message =
        errors.graphQLErrors && errors.graphQLErrors.length > 0
          ? " [" + errors.graphQLErrors[0].message + "]"
          : "";
      enqueueSnackbar?.("Logout fehlgeschlagen" + message, { variant: "error" });
    },
  });

  return (
    <span
      style={{ paddingLeft: "10px", paddingRight: "10px", color: "darkgray", cursor: "pointer" }}
      onMouseDown={() => {
        runLogout({
          variables: {
            user: {
              name: "session",
            },
          },
        });
      }}
    >
      Logout
    </span>
  );
}

export default withContext(Layout);
