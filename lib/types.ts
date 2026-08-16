// lib/types.ts
// Core data shapes shared across the AeroPulse Bike Studio demo.
// No backend — everything here is mock data shaped like a real catalog
// so it can be swapped for a real API/CMS later without touching UI code.

export type RideTerrain = "city" | "road" | "gravel" | "track";
export type RideDistance = "short" | "mid" | "long" | "century";
export type RideFeel = "aero" | "endurance" | "versatile" | "assisted";
export type Budget = "under100" | "100to200" | "200to350" | "over350";
export type Experience = "beginner" | "regular" | "racer";
export type SpecialNeed = "lightest" | "aero-max" | "e-assist" | "packable" | "none";

export interface FinderAnswers {
  terrain: RideTerrain | null;
  distance: RideDistance | null;
  feel: RideFeel | null;
  budget: Budget | null;
  heightCm: number | null;
  experience: Experience | null;
  special: SpecialNeed[];
}

export type SizeLabel = "XS" | "S" | "M" | "L" | "XL";

export interface SizeStock {
  size: SizeLabel;
  heightRangeCm: [number, number];
  inStock: boolean;
  etaDays: number | null; // null when in stock now
}

export type BikeCategory =
  | "aero-road"
  | "endurance-road"
  | "gravel"
  | "time-trial"
  | "urban-performance"
  | "electric-performance";

export interface Bike {
  id: string;
  name: string;
  series: string;
  category: BikeCategory;
  tagline: string;
  priceTHB: number;
  weightKg: number;
  aeroRating: number; // 0-100, higher = more aerodynamic
  comfortRating: number; // 0-100
  groupset: string;
  frame: string;
  terrainFit: RideTerrain[];
  distanceFit: RideDistance[];
  feelFit: RideFeel[];
  experienceFit: Experience[];
  specialTags: SpecialNeed[];
  sizes: SizeStock[];
  heroImagePrompt: string;
  detailImagePrompts: string[];
  specSheet: { label: string; value: string }[];
}

export interface LifestyleImage {
  id: string;
  caption: string;
  prompt: string;
}

export interface MatchResult {
  bike: Bike;
  score: number;
  reasons: string[];
  badge: "BEST FIT" | "BEST VALUE" | "PERFORMANCE PICK";
}

export type AppView =
  | "home"
  | "finder"
  | "results"
  | "product"
  | "compare"
  | "stock"
  | "contact";

export type FinderState =
  | "idle"
  | "answering"
  | "validating"
  | "calculating"
  | "results"
  | "no-match"
  | "incomplete";
