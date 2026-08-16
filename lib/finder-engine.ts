// lib/finder-engine.ts
// Pure functions: recommendation scoring + the Product Finder state machine.
// No side effects, so this is trivially unit-testable on its own.
import { BIKES } from "./data";
import {
  Bike,
  Budget,
  FinderAnswers,
  FinderState,
  MatchResult,
} from "./types";

export const EMPTY_ANSWERS: FinderAnswers = {
  terrain: null,
  distance: null,
  feel: null,
  budget: null,
  heightCm: null,
  experience: null,
  special: [],
};

const BUDGET_CEILING: Record<Budget, number> = {
  under100: 100000,
  "100to200": 200000,
  "200to350": 350000,
  over350: Infinity,
};

const BUDGET_FLOOR: Record<Budget, number> = {
  under100: 0,
  "100to200": 100000,
  "200to350": 200000,
  over350: 350000,
};

export function isAnswersComplete(a: FinderAnswers): boolean {
  return (
    a.terrain !== null &&
    a.distance !== null &&
    a.feel !== null &&
    a.budget !== null &&
    a.heightCm !== null &&
    a.experience !== null
  );
}

function fitsHeight(bike: Bike, heightCm: number): boolean {
  return bike.sizes.some(
    (s) => heightCm >= s.heightRangeCm[0] && heightCm <= s.heightRangeCm[1]
  );
}

function scoreBike(bike: Bike, a: FinderAnswers): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (a.terrain && bike.terrainFit.includes(a.terrain)) {
    score += 22;
    reasons.push("รองรับเส้นทางที่คุณปั่นเป็นหลัก");
  }
  if (a.distance && bike.distanceFit.includes(a.distance)) {
    score += 18;
    reasons.push("เรขาคณิตเฟรมเหมาะกับระยะทางที่คุณปั่นบ่อย");
  }
  if (a.feel && bike.feelFit.includes(a.feel)) {
    score += 22;
    reasons.push("ให้ความรู้สึกการปั่นตรงกับที่คุณต้องการ");
  }
  if (a.experience && bike.experienceFit.includes(a.experience)) {
    score += 12;
    reasons.push("ระดับการควบคุมเหมาะกับประสบการณ์ของคุณ");
  }
  if (a.budget) {
    const floor = BUDGET_FLOOR[a.budget];
    const ceiling = BUDGET_CEILING[a.budget];
    if (bike.priceTHB >= floor && bike.priceTHB <= ceiling) {
      score += 14;
      reasons.push("อยู่ในงบประมาณที่คุณกำหนด");
    } else if (bike.priceTHB < floor) {
      score += 6; // cheaper than budget still counts as viable, lower weight
    }
  }
  if (a.heightCm && fitsHeight(bike, a.heightCm)) {
    score += 8;
    reasons.push("มีไซซ์ที่เหมาะกับส่วนสูงของคุณ");
  } else if (a.heightCm) {
    score -= 30; // no available size is a hard-ish penalty, not a hard block
  }
  if (a.special.length > 0) {
    const matchedSpecials = a.special.filter(
      (s) => s !== "none" && bike.specialTags.includes(s)
    );
    score += matchedSpecials.length * 8;
    if (matchedSpecials.length > 0) {
      reasons.push("ตรงกับความต้องการพิเศษที่คุณเลือก");
    }
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons };
}

export function getRecommendations(answers: FinderAnswers): MatchResult[] {
  const scored = BIKES.map((bike) => {
    const { score, reasons } = scoreBike(bike, answers);
    return { bike, score, reasons };
  })
    .filter((r) => r.score >= 25)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  const bestFit = scored[0];
  const bestValue = [...scored].sort(
    (a, b) => a.bike.priceTHB / (a.score || 1) - b.bike.priceTHB / (b.score || 1)
  )[0];
  const performancePick = [...scored].sort(
    (a, b) => b.bike.aeroRating - a.bike.aeroRating
  )[0];

  const results: MatchResult[] = [];
  const used = new Set<string>();

  results.push({ ...bestFit, badge: "BEST FIT" });
  used.add(bestFit.bike.id);

  if (!used.has(bestValue.bike.id)) {
    results.push({ ...bestValue, badge: "BEST VALUE" });
    used.add(bestValue.bike.id);
  }

  if (!used.has(performancePick.bike.id)) {
    results.push({ ...performancePick, badge: "PERFORMANCE PICK" });
    used.add(performancePick.bike.id);
  }

  // Backfill to 3 cards from the remaining ranked list if badges collided.
  for (const candidate of scored) {
    if (results.length >= 3) break;
    if (!used.has(candidate.bike.id)) {
      results.push({ ...candidate, badge: "PERFORMANCE PICK" });
      used.add(candidate.bike.id);
    }
  }

  return results.slice(0, 3);
}

// ---- Finder state machine ----------------------------------------------
// idle -> answering -> validating -> (invalid -> answering) | (valid -> answering|calculating)
// calculating -> results | no-match
export type FinderEvent =
  | { type: "START" }
  | { type: "ANSWER" }
  | { type: "NEXT"; isLastStep: boolean }
  | { type: "BACK" }
  | { type: "INVALID" }
  | { type: "VALID" }
  | { type: "SUCCESS" }
  | { type: "EMPTY" }
  | { type: "RESET" };

export function finderReducer(state: FinderState, event: FinderEvent): FinderState {
  switch (state) {
    case "idle":
      return event.type === "START" ? "answering" : state;
    case "answering":
      if (event.type === "NEXT") return "validating";
      if (event.type === "BACK") return "answering";
      return state;
    case "validating":
      if (event.type === "INVALID") return "answering";
      if (event.type === "VALID") return "calculating";
      return state;
    case "calculating":
      if (event.type === "SUCCESS") return "results";
      if (event.type === "EMPTY") return "no-match";
      return state;
    case "results":
    case "no-match":
    case "incomplete":
      return event.type === "RESET" ? "idle" : state;
    default:
      return state;
  }
}

export function formatTHB(n: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
}
