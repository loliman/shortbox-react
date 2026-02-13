import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Cookies, withCookies } from "react-cookie";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "../../app/session";
import type { SessionData } from "../../app/session";
import { useResponsive } from "../../app/useResponsive";

type SessionValue = SessionData | null | undefined;

interface AppContextState {
  drawerOpen: boolean;
  loadingComponents: string[];
}

interface AppContextProps {
  cookies?: Cookies;
  children?: React.ReactNode;
}

export interface AppContextValue {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  session: SessionValue;
  handleLogin: (user: SessionValue) => void;
  handleLogout: () => void;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPhonePortrait: boolean;
  compactLayout: boolean;
  navWide: boolean;
  appIsLoading: boolean;
  resetLoadingComponents: () => void;
  registerLoadingComponent: (component: string) => void;
  unregisterLoadingComponent: (component: string) => void;
  isComponentRegistered: (component: string) => string | undefined;
}

const defaultContextValue: AppContextValue = {
  drawerOpen: false,
  toggleDrawer: () => {},
  session: null,
  handleLogin: () => {},
  handleLogout: () => {},
  isPhone: false,
  isTablet: false,
  isDesktop: true,
  isLandscape: false,
  isPhonePortrait: false,
  compactLayout: false,
  navWide: true,
  appIsLoading: false,
  resetLoadingComponents: () => {},
  registerLoadingComponent: () => {},
  unregisterLoadingComponent: () => {},
  isComponentRegistered: () => undefined,
};

export const AppContext = React.createContext<AppContextValue>(defaultContextValue);

function AppContextProvider({ cookies, children }: Readonly<AppContextProps>) {
  const responsive = useResponsive();
  const [state, setState] = useState<AppContextState>(() => {
    return {
      drawerOpen: responsive.navWide,
      loadingComponents: [],
    };
  });

  useEffect(() => {
    setState((prevState) =>
      prevState.drawerOpen === responsive.navWide
        ? prevState
        : {
            ...prevState,
            drawerOpen: responsive.navWide,
          }
    );
  }, [responsive.navWide]);

  const resetLoadingComponents = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      loadingComponents: [],
    }));
  }, []);

  const registerLoadingComponent = useCallback((component: string) => {
    setState((prevState) => {
      if (prevState.loadingComponents.includes(component)) return prevState;
      return {
        ...prevState,
        loadingComponents: [...prevState.loadingComponents, component],
      };
    });
  }, []);

  const unregisterLoadingComponent = useCallback((component: string) => {
    setState((prevState) => ({
      ...prevState,
      loadingComponents: prevState.loadingComponents.filter((c) => c !== component),
    }));
  }, []);

  const isComponentRegistered = useCallback(
    (component: string) => state.loadingComponents.find((c) => c === component),
    [state.loadingComponents]
  );

  const handleLogin = useCallback((_user: SessionValue) => {
    cookies?.set(SESSION_COOKIE_NAME, { loggedIn: true }, getSessionCookieOptions());
  }, [cookies]);

  const handleLogout = useCallback(() => {
    cookies?.remove(SESSION_COOKIE_NAME, { path: "/" });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, [cookies]);

  const toggleDrawer = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      drawerOpen: !prevState.drawerOpen,
    }));
  }, []);

  const session = cookies?.get(SESSION_COOKIE_NAME) as SessionValue;

  const value = useMemo<AppContextValue>(
    () => ({
      drawerOpen: state.drawerOpen,
      toggleDrawer,
      session,
      handleLogin,
      handleLogout,
      isPhone: responsive.isPhone,
      isTablet: responsive.isTablet,
      isDesktop: responsive.isDesktop,
      isLandscape: responsive.isLandscape,
      isPhonePortrait: responsive.isPhonePortrait,
      compactLayout: responsive.isCompact,
      navWide: responsive.navWide,
      appIsLoading: state.loadingComponents.length > 0,
      resetLoadingComponents,
      registerLoadingComponent,
      unregisterLoadingComponent,
      isComponentRegistered,
    }),
    [
      handleLogin,
      handleLogout,
      isComponentRegistered,
      registerLoadingComponent,
      resetLoadingComponents,
      responsive.isCompact,
      responsive.isDesktop,
      responsive.isLandscape,
      responsive.isPhone,
      responsive.isPhoneLandscape,
      responsive.isPhonePortrait,
      responsive.isTablet,
      responsive.isTabletLandscape,
      responsive.navWide,
      session,
      state.drawerOpen,
      state.loadingComponents.length,
      toggleDrawer,
      unregisterLoadingComponent,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default withCookies(AppContextProvider);
