import Card from "@mui/material/Card";
import React from "react";
import TopBar from "./top-bar/TopBar";
import List from "./nav-bar/List";
import { withContext } from "./generic";
import AddFab from "./fab/AddFab";
import Box from "@mui/material/Box";
import FooterLinks from "./footer/FooterLinks";

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
  isPhone?: boolean;
  isPhoneLandscape?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  compactLayout?: boolean;
  isPhonePortrait?: boolean;
  enqueueSnackbar?: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  handleLogout?: () => void;
}

function Layout(props: Readonly<LayoutProps>) {
  const { us, children, session, drawerOpen } = props;
  const temporaryDrawer = props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const drawerWidth = temporaryDrawer ? 320 : 360;
  const contentOffset = !temporaryDrawer && drawerOpen ? `${drawerWidth}px` : 0;

  React.useEffect(() => {
    if (!props.handleScroll) return;

    const onWindowScroll = () => {
      props.handleScroll?.({ target: document.documentElement } as unknown as React.UIEvent<HTMLDivElement>);
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [props.handleScroll]);

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
              <FooterLinks
                isPhonePortrait={props.isPhonePortrait}
                loggedIn={session?.loggedIn}
                navigate={props.navigate}
                enqueueSnackbar={props.enqueueSnackbar}
                handleLogout={props.handleLogout}
              />
            </Box>
          </Card>
        </Box>

        <AddFab us={us} />
      </Box>
    </React.Fragment>
  );
}

export default withContext(Layout);
