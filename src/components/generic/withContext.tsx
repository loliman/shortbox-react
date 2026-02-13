import React, { ComponentType, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext, AppContextValue } from "./AppContext";
import { withCookies } from "react-cookie";
import {
  generateLabel,
  getHierarchyLevel,
  getSelected,
  HierarchyLevel,
} from "../../util/hierarchy";
import * as queryString from "query-string";

type UnknownRecord = Record<string, unknown>;
type NavigationEvent = {
  metaKey?: boolean;
  ctrlKey?: boolean;
  keyCode?: number;
  button?: number;
};

interface RouterBridge {
  location: ReturnType<typeof useLocation>;
  navigateRouter: ReturnType<typeof useNavigate>;
  us: boolean;
}

function getDisplayName(WrappedComponent: ComponentType<unknown>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withContext<T>(WrappedComponent: ComponentType<T>): ComponentType<UnknownRecord> {
  const WithContext = (props: UnknownRecord) => {
    const location = useLocation();
    const navigateRouter = useNavigate();
    const params = useParams();
    const previousLocationRef = useRef<ReturnType<typeof useLocation> | null>(null);
    const currentLocationRef = useRef<ReturnType<typeof useLocation> | null>(null);

    useEffect(() => {
      previousLocationRef.current = currentLocationRef.current;
      currentLocationRef.current = {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state,
        key: location.key,
      };
    }, [location.pathname, location.search, location.hash, location.state, location.key]);

    return (
      <AppContext.Consumer>
        {(context: AppContextValue) => {
          const us =
            location.pathname.indexOf("/us") === 0 ||
            location.pathname.indexOf("/edit/us") === 0 ||
            location.pathname.indexOf("/filter/us") === 0;
          const selected = getSelected(params, us);
          const currentQuery = location.search ? queryString.parse(location.search) : null;
          const locationState = location.state as { from?: ReturnType<typeof useLocation> } | null;
          const lastLocation = locationState?.from ? locationState.from : previousLocationRef.current;

          const contextParams = {
            edit: location.pathname.indexOf("/edit") === 0,
            create: location.pathname.indexOf("/create") === 0,
            us,
            selected,
            query: currentQuery,
            level: getHierarchyLevel(selected),
            lastLocation,
            navigate: (e: NavigationEvent | null, url: string, query?: UnknownRecord) => {
              const newTab = Boolean(
                e &&
                (e.metaKey || e.ctrlKey || e.keyCode === 91 || e.keyCode === 224 || e.button === 1)
              );

              if (e && e.button !== 1 && e.button !== 0) return;

              context.resetLoadingComponents();
              navigate({ location, navigateRouter, us }, url, query, currentQuery, newTab);
            },
          };

          document.title = createAppTitle(contextParams, location.pathname);

          return (
            <WrappedComponent
              {...(contextParams as unknown as T)}
              {...(context as unknown as T)}
              {...(props as unknown as T)}
            />
          );
        }}
      </AppContext.Consumer>
    );
  };

  WithContext.displayName = `WithContext(${getDisplayName(WrappedComponent)})`;

  return withEnqueueSnackbar(withCookies(WithContext));
}

function withEnqueueSnackbar<T>(WrappedComponent: ComponentType<T>): ComponentType<UnknownRecord> {
  const WithEnqueueSnackbar = (props: UnknownRecord) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return (
      <WrappedComponent
        {...(props as unknown as T)}
        {...({ enqueueSnackbar, closeSnackbar } as unknown as T)}
      />
    );
  };

  WithEnqueueSnackbar.displayName = `WithEnqueueSnackbar(${getDisplayName(WrappedComponent)})`;

  return WithEnqueueSnackbar;
}

function navigate(
  router: RouterBridge,
  url: string,
  query?: UnknownRecord,
  currentQuery?: UnknownRecord | null,
  newTab?: boolean
) {
  const lastUrl = router.location ? router.location.pathname : null;
  const q: UnknownRecord = currentQuery ? { ...currentQuery } : {};
  q.expand = undefined;

  if (query) {
    for (const p in query) {
      if (Object.prototype.hasOwnProperty.call(query, p)) {
        q[p] = query[p] ? query[p] : undefined;
      }
    }
  }

  const targetUrl =
    (lastUrl === url && query === currentQuery ? (router.us ? "/us" : "/de") : url) +
    "?" +
    queryString.stringify(q);

  if (newTab) globalThis.open(targetUrl, "_blank", "noreferrer");
  else router.navigateRouter(targetUrl);
}

interface AppTitleParams {
  edit: boolean;
  create: boolean;
  selected: unknown;
  us: boolean;
  level: string;
}

function createAppTitle(params: AppTitleParams, url: string): string {
  let title: string;
  if (params.edit) title = generateLabel(params.selected) + " bearbeiten";
  else if (params.create) {
    if (url.indexOf("/issue") !== -1) title = "Ausgabe";
    else if (url.indexOf("/series") !== -1) title = "Serie";
    else title = "Verlag";

    title += " erstellen";
  } else {
    title = generateLabel(params.selected);
  }

  if (params.us) title += " | US";
  if (params.level !== HierarchyLevel.ROOT || params.edit || params.create) title += " - Shortbox";

  return title;
}

export default withContext;
