import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Cookies, withCookies } from "react-cookie";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "../../app/session";
import type { SessionCookie } from "../../app/session";

type SessionValue = SessionCookie | null | undefined;

interface ViewportState {
  mobile: boolean;
  mobileLandscape: boolean;
  tablet: boolean;
  tabletLandscape: boolean;
  desktop: boolean;
}

interface AppContextState extends ViewportState {
  drawerOpen: boolean;
  loadingComponents: string[];
}

interface AppContextProps {
  cookies?: Cookies;
  children?: React.ReactNode;
}

export interface AppContextValue {
  drawerOpen: boolean;
  toogleDrawer: () => void;
  session: SessionValue;
  handleLogin: (user: SessionValue) => void;
  handleLogout: () => void;
  mobile: boolean;
  mobileLandscape: boolean;
  tablet: boolean;
  tabletLandscape: boolean;
  desktop: boolean;
  appIsLoading: boolean;
  resetLoadingComponents: () => void;
  registerLoadingComponent: (component: string) => void;
  unregisterLoadingComponent: (component: string) => void;
  isComponentRegistered: (component: string) => string | undefined;
}

const defaultContextValue: AppContextValue = {
  drawerOpen: false,
  toogleDrawer: () => {},
  session: null,
  handleLogin: () => {},
  handleLogout: () => {},
  mobile: false,
  mobileLandscape: false,
  tablet: false,
  tabletLandscape: false,
  desktop: true,
  appIsLoading: false,
  resetLoadingComponents: () => {},
  registerLoadingComponent: () => {},
  unregisterLoadingComponent: () => {},
  isComponentRegistered: () => undefined,
};

export const AppContext = React.createContext<AppContextValue>(defaultContextValue);

function isLandscape(): boolean {
  if (typeof window === "undefined") return false;
  const orientation = window.screen?.orientation;
  if (orientation) return orientation.angle === 90 || orientation.angle === 270;
  const legacyOrientation = window.orientation;
  return legacyOrientation === 90 || legacyOrientation === -90;
}

function computeViewportState(): ViewportState {
  if (typeof window === "undefined") {
    return {
      mobile: false,
      mobileLandscape: false,
      tablet: false,
      tabletLandscape: false,
      desktop: true,
    };
  }

  const landscape = isLandscape();
  const width = window.innerWidth;
  const mobile = !landscape ? width >= 320 && width <= 480 : width >= 481 && width <= 861;
  const tablet = !landscape ? width >= 768 && width <= 1024 : width >= 861 && width <= 1024;
  const mobileLandscape = mobile && landscape;
  const tabletLandscape = tablet && landscape;
  const desktop = !mobile && !mobileLandscape && !tablet && !tabletLandscape;

  return {
    mobile,
    mobileLandscape,
    tablet,
    tabletLandscape,
    desktop,
  };
}

function AppContextProvider({ cookies, children }: Readonly<AppContextProps>) {
  const [state, setState] = useState<AppContextState>(() => {
    const viewport = computeViewportState();
    return {
      ...viewport,
      drawerOpen: viewport.desktop || viewport.tabletLandscape,
      loadingComponents: [],
    };
  });

  useEffect(() => {
    const syncViewport = () => {
      const viewport = computeViewportState();
      setState((prevState) => {
        const navWide = viewport.desktop || viewport.tabletLandscape;
        const prevWide = prevState.desktop || prevState.tabletLandscape;
        return {
          ...prevState,
          ...viewport,
          drawerOpen: prevWide !== navWide ? navWide : prevState.drawerOpen,
        };
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    window.addEventListener("orientationchange", syncViewport);
    return () => {
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
    };
  }, []);

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

  const handleLogin = useCallback(
    (_user: SessionValue) => {
      cookies?.set(SESSION_COOKIE_NAME, { loggedIn: true }, getSessionCookieOptions());
    },
    [cookies]
  );

  const handleLogout = useCallback(() => {
    cookies?.remove(SESSION_COOKIE_NAME, { path: "/" });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, [cookies]);

  const toogleDrawer = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      drawerOpen: !prevState.drawerOpen,
    }));
  }, []);

  const session = cookies?.get(SESSION_COOKIE_NAME) as SessionValue;

  const value = useMemo<AppContextValue>(
    () => ({
      drawerOpen: state.drawerOpen,
      toogleDrawer,
      session,
      handleLogin,
      handleLogout,
      mobile: state.mobile,
      mobileLandscape: state.mobileLandscape,
      tablet: state.tablet,
      tabletLandscape: state.tabletLandscape,
      desktop: state.desktop,
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
      session,
      state.desktop,
      state.drawerOpen,
      state.loadingComponents.length,
      state.mobile,
      state.mobileLandscape,
      state.tablet,
      state.tabletLandscape,
      toogleDrawer,
      unregisterLoadingComponent,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default withCookies(AppContextProvider);
