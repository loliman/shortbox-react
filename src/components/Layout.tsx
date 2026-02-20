import Card from "@mui/material/Card";
import React from "react";
import TopBar from "./top-bar/TopBar";
import List from "./nav-bar/List";
import { withContext } from "./generic";
import AddFab from "./fab/AddFab";
import Box from "@mui/material/Box";
import FooterLinks from "./footer/FooterLinks";
import { getNavDrawerWidth } from "./layoutMetrics";

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
  const temporaryDrawer =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const drawerWidth = getNavDrawerWidth(temporaryDrawer);
  const contentOffset = !temporaryDrawer && drawerOpen ? `${drawerWidth}px` : 0;

  React.useEffect(() => {
    if (!props.handleScroll) return;

    const onWindowScroll = () => {
      props.handleScroll?.({
        target: document.documentElement,
      } as unknown as React.UIEvent<HTMLDivElement>);
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [props.handleScroll]);

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <TopBar />

      <Box component="main" sx={{ display: "flex", flexGrow: 1, minHeight: 0 }}>
        <List />

        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            minWidth: 0,
            px: { xs: 1, sm: 2 },
            py: 2,
            ml: contentOffset,
            transition: (theme) =>
              theme.transitions.create("margin-left", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
          onScroll={(e) => (props.handleScroll ? props.handleScroll(e) : false)}
        >
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Box sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, minHeight: 0 }}>{children}</Box>

            <Box
              sx={{
                mt: "auto",
                px: { xs: 1.5, sm: 2 },
                py: 1.25,
                borderTop: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
                position: "sticky",
                bottom: 0,
                zIndex: 1,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
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
    </Box>
  );
}

export default withContext(Layout);
