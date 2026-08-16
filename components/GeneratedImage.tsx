"use client";

import { useGeneratedImage } from "@/lib/use-generated-image";

interface GeneratedImageProps {
  prompt: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function GeneratedImage({
  prompt,
  alt,
  width = 1024,
  height = 768,
  className = "",
}: GeneratedImageProps) {
  const { url, loading } = useGeneratedImage(prompt, { width, height });

  return (
    <div
      className={`relative overflow-hidden bg-carbon-800 ${className}`}
      aria-busy={loading}
    >
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-carbon-800 via-carbon-700 to-carbon-800" />
      )}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
}
