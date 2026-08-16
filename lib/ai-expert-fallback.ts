// lib/ai-expert-fallback.ts
// Zero-config fallback for the AI Expert chat: a small Thai/English keyword
// extractor that fills in whatever FinderAnswers fields it can confidently
// detect from a user's free-text message, without calling any LLM.
//
// This exists for the same reason app/api/generate-image/route.ts falls
// back to a placeholder image service: the demo must work with no API keys
// configured at all. When ANTHROPIC_API_KEY is set, the real route uses
// Claude instead (see app/api/ai-expert/route.ts) and this is skipped.
import { FinderAnswers } from "./types";

const TERRAIN_HINTS: [RegExp, FinderAnswers["terrain"]][] = [
  [/ในเมือง|คอมมิวเตอร์|city|commute/i, "city"],
  [/ทางไกล|ถนนใหญ่|ถนน|road/i, "road"],
  [/กรวด|ลูกรัง|gravel|ออฟโรด/i, "gravel"],
  [/สนามแข่ง|แข่ง|track|ไทม์ไทรอัล/i, "track"],
];

const DISTANCE_HINTS: [RegExp, FinderAnswers["distance"]][] = [
  [/century|100\s*กม|100km/i, "century"],
  [/60|70|80|90|ไกล/i, "long"],
  [/20|30|40|50/i, "mid"],
  [/สั้น|ใกล้|ไม่ไกล|10\s*กม/i, "short"],
];

const FEEL_HINTS: [RegExp, FinderAnswers["feel"]][] = [
  [/เร็ว|aero|แอโร|สปีด/i, "aero"],
  [/สบาย|endurance|ทั้งวัน/i, "endurance"],
  [/ไฟฟ้า|ช่วยปั่น|e-assist|มอเตอร์/i, "assisted"],
  [/อเนกประสงค์|หลายทาง|versatile/i, "versatile"],
];

const BUDGET_HINTS: [RegExp, FinderAnswers["budget"]][] = [
  [/350|400|450|เกินสามแสนห้า|over ?350/i, "over350"],
  [/2\s*แสน|200,?000|250|300|สองแสน|300,?000/i, "200to350"],
  [/1\s*แสน\s*5|150,?000|แสนห้า|100,?000|หนึ่งแสน/i, "100to200"],
  [/under ?100|ไม่เกินแสน|ต่ำกว่าแสน/i, "under100"],
];

const EXPERIENCE_HINTS: [RegExp, FinderAnswers["experience"]][] = [
  [/นักแข่ง|racer|ซ้อมหนัก/i, "racer"],
  [/ประจำ|บ่อย|regular/i, "regular"],
  [/มือใหม่|เริ่มต้น|beginner/i, "beginner"],
];

function firstMatch<T>(text: string, hints: [RegExp, T][]): T | null {
  for (const [re, value] of hints) {
    if (re.test(text)) return value;
  }
  return null;
}

function extractHeight(text: string): number | null {
  const m = text.match(/(1[3-9]\d|2[01]\d)\s*(ซม|cm)?/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 130 && n <= 210 ? n : null;
}

export function extractAnswersFromText(
  text: string,
  base: FinderAnswers
): { answers: FinderAnswers; matchedFields: string[] } {
  const matchedFields: string[] = [];
  const answers: FinderAnswers = { ...base };

  const terrain = firstMatch(text, TERRAIN_HINTS);
  if (terrain && !answers.terrain) {
    answers.terrain = terrain;
    matchedFields.push("terrain");
  }
  const distance = firstMatch(text, DISTANCE_HINTS);
  if (distance && !answers.distance) {
    answers.distance = distance;
    matchedFields.push("distance");
  }
  const feel = firstMatch(text, FEEL_HINTS);
  if (feel && !answers.feel) {
    answers.feel = feel;
    matchedFields.push("feel");
  }
  const budget = firstMatch(text, BUDGET_HINTS);
  if (budget && !answers.budget) {
    answers.budget = budget;
    matchedFields.push("budget");
  }
  const experience = firstMatch(text, EXPERIENCE_HINTS);
  if (experience && !answers.experience) {
    answers.experience = experience;
    matchedFields.push("experience");
  }
  const height = extractHeight(text);
  if (height && !answers.heightCm) {
    answers.heightCm = height;
    matchedFields.push("heightCm");
  }

  return { answers, matchedFields };
}

const FIELD_QUESTIONS: Record<string, string> = {
  terrain: "ปกติคุณปั่นในเมือง ถนนใหญ่ กรวด หรือสนามแข่งเป็นหลักครับ?",
  distance: "ปั่นประมาณกี่กิโลเมตรต่อครั้งครับ?",
  feel: "ระหว่าง \"ความเร็ว\" กับ \"ความสบาย\" อะไรสำคัญกับคุณมากกว่ากันครับ?",
  budget: "งบประมาณโดยรวมของคันนี้ประมาณเท่าไรครับ?",
  heightCm: "ส่วนสูงของคุณเท่าไรครับ จะได้แนะนำไซซ์เบื้องต้น?",
  experience: "ปั่นมานานหรือยังครับ มือใหม่ ปั่นประจำ หรือสายแข่ง?",
};

export function nextFallbackQuestion(answers: FinderAnswers): string | null {
  const order: (keyof FinderAnswers)[] = [
    "terrain",
    "distance",
    "feel",
    "budget",
    "heightCm",
    "experience",
  ];
  for (const key of order) {
    if (!answers[key]) return FIELD_QUESTIONS[key];
  }
  return null;
}
