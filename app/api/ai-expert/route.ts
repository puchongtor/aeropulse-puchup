// app/api/ai-expert/route.ts
// This is the "AI CHAT" entry point in the architecture:
//
//   CUSTOMER -> SMART UI (Finder.tsx)  \
//            -> AI CHAT (this route)    >-> BUSINESS ENGINE (lib/finder-engine.ts) -> RESULT
//
// Chat is just another interface onto the same FinderAnswers shape and the
// same getRecommendations() engine — no separate recommendation logic lives
// here. This route's only job is: given the conversation so far, (a) reply
// like a helpful bike specialist, and (b) extract whichever FinderAnswers
// fields it can confidently read out of what the customer just said.
//
// Env: ANTHROPIC_API_KEY (server-only). Without it, falls back to a small
// rule-based Thai keyword extractor (lib/ai-expert-fallback.ts) so the chat
// still functions with zero configuration — same philosophy as the Imagen
// route's placeholder fallback.
import { NextRequest, NextResponse } from "next/server";
import { FinderAnswers } from "@/lib/types";
import { EMPTY_ANSWERS, isAnswersComplete } from "@/lib/finder-engine";
import { extractAnswersFromText, nextFallbackQuestion } from "@/lib/ai-expert-fallback";

export const runtime = "nodejs";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_CHAT_MODEL || "claude-3-5-haiku-latest";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  history: ChatMessage[];
  currentAnswers: FinderAnswers;
}

const EXTRACT_TOOL = {
  name: "record_finder_answers",
  description:
    "บันทึกข้อมูลที่ได้จากลูกค้าลงในโครงสร้าง Finder Answers และตอบกลับลูกค้าแบบผู้เชี่ยวชาญจักรยาน",
  input_schema: {
    type: "object" as const,
    properties: {
      reply: {
        type: "string",
        description:
          "ข้อความตอบกลับลูกค้าเป็นภาษาไทย สุภาพ กระชับ เหมือนผู้เชี่ยวชาญร้านจักรยานคุยกับลูกค้า ถ้าข้อมูลยังไม่ครบให้ถามคำถามถัดไปทีละข้อเดียว",
      },
      terrain: { type: "string", enum: ["city", "road", "gravel", "track"] },
      distance: { type: "string", enum: ["short", "mid", "long", "century"] },
      feel: { type: "string", enum: ["aero", "endurance", "versatile", "assisted"] },
      budget: { type: "string", enum: ["under100", "100to200", "200to350", "over350"] },
      heightCm: { type: "number" },
      experience: { type: "string", enum: ["beginner", "regular", "racer"] },
      special: {
        type: "array",
        items: { type: "string", enum: ["lightest", "aero-max", "e-assist", "packable"] },
      },
      readyForResults: {
        type: "boolean",
        description: "true ถ้าตอนนี้มีข้อมูลพอที่จะแนะนำจักรยานได้แล้ว (มี terrain, distance, feel, budget, heightCm, experience ครบ)",
      },
    },
    required: ["reply", "readyForResults"],
  },
};

const SYSTEM_PROMPT = `คุณคือ "AeroPulse Expert" ผู้เชี่ยวชาญจักรยานสมรรถนะสูงของร้าน AeroPulse Bike Studio
บทบาทของคุณคือช่วยลูกค้าหาจักรยานที่เหมาะสม โดยคุยแบบเป็นกันเองแต่มืออาชีพ ถามทีละคำถาม ไม่ถามรวดเดียวหลายข้อ
ข้อมูลที่ต้องเก็บให้ครบก่อนสรุปผล: terrain (เส้นทางที่ปั่น), distance (ระยะทางต่อครั้ง), feel (เร็ว/สบาย/อเนกประสงค์/ไฟฟ้าช่วย), budget (งบประมาณ), heightCm (ส่วนสูง), experience (ระดับประสบการณ์)
ทุกครั้งที่ตอบ ให้เรียกเครื่องมือ record_finder_answers เสมอ โดยใส่เฉพาะฟิลด์ที่ลูกค้าเพิ่งให้ข้อมูลมาในข้อความล่าสุด (ไม่ต้องเดาฟิลด์ที่ยังไม่ได้พูดถึง)
ห้ามพูดเรื่องนอกเหนือจากการช่วยเลือกจักรยานของร้าน AeroPulse โดยเด็ดขาด
ห้ามบอกราคาหรือสเปกเจาะจงเอง ปล่อยให้ระบบ Finder เป็นคนแนะนำรุ่นหลังจากข้อมูลครบ`;

async function callClaude(history: ChatMessage[], currentAnswers: FinderAnswers) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 400,
      system: `${SYSTEM_PROMPT}\n\nข้อมูลที่เก็บได้แล้วตอนนี้: ${JSON.stringify(currentAnswers)}`,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
      tools: [EXTRACT_TOOL],
      tool_choice: { type: "tool", name: "record_finder_answers" },
    }),
  });

  if (!res.ok) throw new Error(`Claude API responded ${res.status}`);
  const data = await res.json();
  const toolUse = (data.content || []).find((b: { type: string }) => b.type === "tool_use");
  if (!toolUse) throw new Error("No tool_use block in Claude response.");
  return toolUse.input as {
    reply: string;
    terrain?: FinderAnswers["terrain"];
    distance?: FinderAnswers["distance"];
    feel?: FinderAnswers["feel"];
    budget?: FinderAnswers["budget"];
    heightCm?: number;
    experience?: FinderAnswers["experience"];
    special?: NonNullable<FinderAnswers["special"]>;
    readyForResults: boolean;
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as RequestBody | null;
  if (!body || !Array.isArray(body.history)) {
    return NextResponse.json({ error: "Missing 'history'." }, { status: 400 });
  }

  const currentAnswers: FinderAnswers = body.currentAnswers ?? EMPTY_ANSWERS;
  const lastUserMessage = [...body.history].reverse().find((m) => m.role === "user");

  try {
    const result = await callClaude(body.history, currentAnswers);
    if (result) {
      const merged: FinderAnswers = {
        ...currentAnswers,
        terrain: result.terrain ?? currentAnswers.terrain,
        distance: result.distance ?? currentAnswers.distance,
        feel: result.feel ?? currentAnswers.feel,
        budget: result.budget ?? currentAnswers.budget,
        heightCm: result.heightCm ?? currentAnswers.heightCm,
        experience: result.experience ?? currentAnswers.experience,
        special: result.special ?? currentAnswers.special,
      };
      return NextResponse.json({
        source: "claude",
        reply: result.reply,
        answers: merged,
        readyForResults: result.readyForResults || isAnswersComplete(merged),
      });
    }
  } catch {
    // fall through to rule-based fallback below
  }

  // ---- Zero-config fallback (no ANTHROPIC_API_KEY, or the call failed) ----
  const { answers: merged, matchedFields } = extractAnswersFromText(
    lastUserMessage?.content ?? "",
    currentAnswers
  );
  const complete = isAnswersComplete(merged);
  const nextQuestion = nextFallbackQuestion(merged);

  const reply = complete
    ? "ได้ข้อมูลครบแล้วครับ กดดูผลลัพธ์ได้เลยเพื่อดู 3 รุ่นที่เหมาะกับคุณที่สุด"
    : matchedFields.length > 0
    ? `รับทราบครับ ${nextQuestion ?? ""}`
    : `ขอโทษครับ ช่วยเล่าเพิ่มอีกนิดได้ไหมครับ — ${nextQuestion ?? "เช่น เส้นทางที่ปั่น งบประมาณ หรือส่วนสูงครับ"}`;

  return NextResponse.json({
    source: "fallback",
    reply,
    answers: merged,
    readyForResults: complete,
  });
}
