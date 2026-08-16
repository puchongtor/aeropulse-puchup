// app/api/generate-image/route.ts
// Server-only endpoint so the Google Imagen API key never reaches the browser.
//
// Flow:
//   1. If GOOGLE_IMAGEN_API_KEY is set, call Imagen 3 (predict endpoint) and
//      return a base64 data URL.
//   2. If the key is missing, or the call fails/times out for any reason
//      (quota, network, region), fall back to a deterministic placeholder
//      image so the demo always renders — this is what makes the site
//      "preview instantly" with zero configuration.
//
// Env vars (set in .env.local, never commit):
//   GOOGLE_IMAGEN_API_KEY   - API key with access to the Imagen API
//   GOOGLE_IMAGEN_MODEL     - optional, defaults to "imagen-3.0-generate-002"

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const IMAGEN_MODEL = process.env.GOOGLE_IMAGEN_MODEL || "imagen-3.0-generate-002";
const IMAGEN_ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;

function hashToSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic, key-free fallback: same prompt always resolves to the same
// image, so the catalog looks stable across reloads even without Imagen.
function fallbackImageUrl(prompt: string, width: number, height: number): string {
  const seed = hashToSeed(prompt);
  return `https://picsum.photos/seed/aeropulse-${seed}/${width}/${height}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const prompt: string | undefined = body?.prompt;
  const width: number = Number(body?.width) || 1024;
  const height: number = Number(body?.height) || 1024;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing 'prompt' string." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_IMAGEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      source: "fallback",
      url: fallbackImageUrl(prompt, width, height),
      reason: "GOOGLE_IMAGEN_API_KEY not set — using placeholder image service.",
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(`${IMAGEN_ENDPOINT(IMAGEN_MODEL)}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: width >= height ? "4:3" : "3:4",
        },
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Imagen API responded ${res.status}`);
    }

    const data = await res.json();
    const base64: string | undefined =
      data?.predictions?.[0]?.bytesBase64Encoded;

    if (!base64) {
      throw new Error("Imagen API returned no image bytes.");
    }

    return NextResponse.json({
      source: "imagen",
      url: `data:image/png;base64,${base64}`,
    });
  } catch (err) {
    // Any failure (quota, network, region lock) — degrade to fallback rather
    // than breaking the page. The UI never needs to know which branch ran.
    return NextResponse.json({
      source: "fallback",
      url: fallbackImageUrl(prompt, width, height),
      reason: err instanceof Error ? err.message : "Unknown Imagen error.",
    });
  }
}
