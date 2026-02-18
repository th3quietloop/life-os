"use client";

import { useRef, useCallback } from "react";

export function useDebouncedSave<T>(
  saveFn: (data: T) => Promise<void>,
  delay: number = 800
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestDataRef = useRef<T | null>(null);

  const debouncedSave = useCallback(
    (data: T) => {
      latestDataRef.current = data;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(async () => {
        if (latestDataRef.current !== null) {
          await saveFn(latestDataRef.current);
        }
      }, delay);
    },
    [saveFn, delay]
  );

  const flush = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (latestDataRef.current !== null) {
      await saveFn(latestDataRef.current);
      latestDataRef.current = null;
    }
  }, [saveFn]);

  return { debouncedSave, flush };
}
