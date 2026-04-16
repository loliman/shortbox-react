import type React from "react";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

export function shouldHandleClientSideNavigation(
  event: React.MouseEvent<HTMLElement>,
  target?: string
): boolean {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return false;
  if (target && target !== "_self") return false;
  return true;
}

export function handleInAppLinkClick(
  event: React.MouseEvent<HTMLElement>,
  url: string,
  navigate?: NavigateFn,
  query?: Record<string, unknown>
): void {
  if (!navigate) return;
  if (
    !shouldHandleClientSideNavigation(
      event,
      event.currentTarget.getAttribute("target") || undefined
    )
  )
    return;
  event.preventDefault();
  navigate(event, url, query);
}
