import React from "react";

export function useResolvedImageUrl(candidateUrl: string, fallbackUrl: string): string {
  const [resolvedUrl, setResolvedUrl] = React.useState(fallbackUrl);

  React.useEffect(() => {
    const nextCandidate = candidateUrl || fallbackUrl;
    if (nextCandidate === fallbackUrl) {
      setResolvedUrl(fallbackUrl);
      return;
    }

    let isCancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!isCancelled) setResolvedUrl(nextCandidate);
    };
    img.onerror = () => {
      if (!isCancelled) setResolvedUrl(fallbackUrl);
    };
    img.src = nextCandidate;

    return () => {
      isCancelled = true;
    };
  }, [candidateUrl, fallbackUrl]);

  return resolvedUrl;
}
