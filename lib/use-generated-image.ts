"use client";

// lib/use-generated-image.ts
// Client hook that requests an image for a given prompt from
// /api/generate-image, with an in-memory cache so the same prompt is never
// fetched twice in one session (10 products + 5 lifestyle shots = 15 calls max).

import { useEffect, useState } from "react";

const cache = new Map<string, string>();

interface Options {
  width?: number;
  height?: number;
}

export function useGeneratedImage(prompt: string, opts: Options = {}) {
  const { width = 1024, height = 768 } = opts;
  const cacheKey = `${prompt}__${width}x${height}`;
  const [url, setUrl] = useState<string | null>(cache.get(cacheKey) ?? null);
  const [loading, setLoading] = useState(!cache.has(cacheKey));

  useEffect(() => {
    if (cache.has(cacheKey)) {
      setUrl(cache.get(cacheKey)!);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, width, height }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const resolvedUrl: string =
          data?.url ??
          `https://picsum.photos/seed/aeropulse-fallback/${width}/${height}`;
        cache.set(cacheKey, resolvedUrl);
        setUrl(resolvedUrl);
      })
      .catch(() => {
        if (cancelled) return;
        const resolvedUrl = `https://picsum.photos/seed/aeropulse-fallback/${width}/${height}`;
        cache.set(cacheKey, resolvedUrl);
        setUrl(resolvedUrl);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return { url, loading };
}
