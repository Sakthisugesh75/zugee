// lib/use-media-query.js
import { useCallback, useSyncExternalStore } from "react";

// Subscribes to a CSS media query. Returns false on the server and during hydration.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
