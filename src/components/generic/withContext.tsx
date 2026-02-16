import React, { ComponentType, useContext, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "./AppContext";
import type { SelectedRoot } from "../../types/domain";
import {
  generateLabel,
  getHierarchyLevel,
  getSelected,
  HierarchyLevel,
} from "../../util/hierarchy";
import queryString from "query-string";

type UnknownRecord = Record<string, unknown>;
type NavigationEvent = {
  metaKey?: boolean;
  ctrlKey?: boolean;
  keyCode?: number;
  button?: number;
};

interface RouterBridge {
  navigateRouter: ReturnType<typeof useNavigate>;
}

function getDisplayName(WrappedComponent: ComponentType<any>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withContext<T extends object>(
  WrappedComponent: ComponentType<T>
): ComponentType<UnknownRecord> {
  const WithContext = (props: UnknownRecord) => {
    const context = useContext(AppContext);
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

    const us =
      location.pathname.indexOf("/us") === 0 ||
      location.pathname.indexOf("/edit/us") === 0 ||
      location.pathname.indexOf("/filter/us") === 0;
    const selected = getSelected(params, us);
    const currentQuery = location.search
      ? (queryString.parse(location.search) as UnknownRecord)
      : null;
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
          e && (e.metaKey || e.ctrlKey || e.keyCode === 91 || e.keyCode === 224 || e.button === 1)
        );

        if (e && e.button !== 1 && e.button !== 0) return;

        context.resetLoadingComponents();
        navigate({ navigateRouter }, url, query, currentQuery, newTab);
      },
    };

    const appTitle = createAppTitle(contextParams, location.pathname);
    useEffect(() => {
      document.title = appTitle;
    }, [appTitle]);

    return (
      <WrappedComponent
        {...(contextParams as unknown as T)}
        {...(context as unknown as T)}
        {...(props as unknown as T)}
      />
    );
  };

  WithContext.displayName = `WithContext(${getDisplayName(WrappedComponent)})`;

  return withEnqueueSnackbar(WithContext);
}

function withEnqueueSnackbar<T extends object>(
  WrappedComponent: ComponentType<T>
): ComponentType<UnknownRecord> {
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
  const q: UnknownRecord = currentQuery ? { ...currentQuery } : {};
  q.expand = undefined;

  if (query) {
    for (const p in query) {
      if (Object.prototype.hasOwnProperty.call(query, p)) {
        q[p] = query[p] ? query[p] : undefined;
      }
    }
  }

  const mergedQuery = queryString.stringify(q);
  const targetUrl = mergedQuery ? `${url}?${mergedQuery}` : url;

  if (newTab) globalThis.open(targetUrl, "_blank", "noreferrer");
  else router.navigateRouter(targetUrl);
}

interface AppTitleParams {
  edit: boolean;
  create: boolean;
  selected: SelectedRoot;
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
