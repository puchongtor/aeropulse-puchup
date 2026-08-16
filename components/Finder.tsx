"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import {
  Budget,
  Experience,
  FinderAnswers,
  FinderState,
  RideDistance,
  RideFeel,
  RideTerrain,
  SpecialNeed,
} from "@/lib/types";
import { EMPTY_ANSWERS, isAnswersComplete } from "@/lib/finder-engine";

interface FinderProps {
  onComplete: (answers: FinderAnswers) => void;
  onExit: () => void;
}

type StepId =
  | "terrain"
  | "distance"
  | "feel"
  | "budget"
  | "height"
  | "experience"
  | "special";

const STEPS: { id: StepId; title: string; sub: string; required: boolean }[] = [
  { id: "terrain", title: "คุณจะปั่นที่ไหนเป็นหลัก", sub: "เลือกเส้นทางที่คุณปั่นบ่อยที่สุด", required: true },
  { id: "distance", title: "ปั่นระยะทางประมาณเท่าไรต่อครั้ง", sub: "โดยเฉลี่ยต่อทริป", required: true },
  { id: "feel", title: "ต้องการความรู้สึกแบบไหนตอนปั่น", sub: "เลือกสิ่งที่สำคัญที่สุดสำหรับคุณ", required: true },
  { id: "budget", title: "งบประมาณโดยประมาณ", sub: "ทั้งคัน รวมกรุ๊ปเซ็ต", required: true },
  { id: "height", title: "ส่วนสูงของคุณ", sub: "ใช้คำนวณไซซ์เฟรมเบื้องต้น", required: true },
  { id: "experience", title: "ระดับประสบการณ์การปั่น", sub: "ช่วยเลือกเรขาคณิตที่ควบคุมง่ายหรือดุดันขึ้น", required: true },
  { id: "special", title: "ความต้องการพิเศษ", sub: "เลือกได้มากกว่า 1 ข้อ หรือข้ามได้", required: false },
];

const TERRAIN_OPTS: { value: RideTerrain; label: string }[] = [
  { value: "city", label: "ในเมือง / คอมมิวเตอร์" },
  { value: "road", label: "ถนนใหญ่ / ทางไกล" },
  { value: "gravel", label: "กรวด / ทางลูกรัง" },
  { value: "track", label: "สนามแข่ง / ไทม์ไทรอัล" },
];

const DISTANCE_OPTS: { value: RideDistance; label: string }[] = [
  { value: "short", label: "ต่ำกว่า 20 กม." },
  { value: "mid", label: "20–60 กม." },
  { value: "long", label: "60–100 กม." },
  { value: "century", label: "100 กม. ขึ้นไป" },
];

const FEEL_OPTS: { value: RideFeel; label: string; hint: string }[] = [
  { value: "aero", label: "เร็วที่สุด เท่าที่แรงจะไหว", hint: "Aero speed" },
  { value: "endurance", label: "สบายตัวได้ทั้งวัน", hint: "Endurance comfort" },
  { value: "versatile", label: "อเนกประสงค์ ปรับใช้ได้หลายทาง", hint: "Versatile" },
  { value: "assisted", label: "มีแรงช่วยตอนเหนื่อย", hint: "E-assist" },
];

const BUDGET_OPTS: { value: Budget; label: string }[] = [
  { value: "under100", label: "ต่ำกว่า 100,000 บาท" },
  { value: "100to200", label: "100,000–200,000 บาท" },
  { value: "200to350", label: "200,000–350,000 บาท" },
  { value: "over350", label: "350,000 บาทขึ้นไป" },
];

const EXPERIENCE_OPTS: { value: Experience; label: string }[] = [
  { value: "beginner", label: "มือใหม่ เริ่มปั่นจริงจัง" },
  { value: "regular", label: "ปั่นประจำ / สัปดาห์ละหลายครั้ง" },
  { value: "racer", label: "นักแข่ง / ซ้อมหนัก" },
];

const SPECIAL_OPTS: { value: SpecialNeed; label: string }[] = [
  { value: "lightest", label: "น้ำหนักเบาที่สุด" },
  { value: "aero-max", label: "แอโรไดนามิกสูงสุด" },
  { value: "e-assist", label: "ต้องการไฟฟ้าช่วยปั่น" },
  { value: "packable", label: "พับเก็บ / พกพาได้" },
];

export default function Finder({ onComplete, onExit }: FinderProps) {
  const [finderState, setFinderState] = useState<FinderState>("answering");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>(EMPTY_ANSWERS);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const progressPct = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const currentValueSet = useMemo(() => {
    switch (step.id) {
      case "terrain":
        return answers.terrain !== null;
      case "distance":
        return answers.distance !== null;
      case "feel":
        return answers.feel !== null;
      case "budget":
        return answers.budget !== null;
      case "height":
        return answers.heightCm !== null && answers.heightCm >= 130 && answers.heightCm <= 210;
      case "experience":
        return answers.experience !== null;
      case "special":
        return true; // optional step, always "valid"
      default:
        return false;
    }
  }, [answers, step.id]);

  function goNext() {
    setFinderState("validating");
    if (!step.required) {
      setFinderState("answering");
      advance();
      return;
    }
    if (!currentValueSet) {
      setError(
        step.id === "height"
          ? "กรุณากรอกส่วนสูงระหว่าง 130–210 ซม."
          : "กรุณาเลือกคำตอบก่อนไปข้อถัดไป"
      );
      setFinderState("answering");
      return;
    }
    setError(null);
    setFinderState("answering");
    advance();
  }

  function advance() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    if (!isAnswersComplete(answers)) {
      setFinderState("incomplete");
      setError("กรุณาตอบคำถามที่จำเป็นให้ครบก่อนดูผลลัพธ์");
      return;
    }
    setFinderState("calculating");
    setTimeout(() => onComplete(answers), 900);
  }

  function goBack() {
    setError(null);
    if (stepIndex === 0) {
      onExit();
      return;
    }
    setStepIndex((i) => i - 1);
  }

  function skipStep() {
    setError(null);
    advance();
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] tracking-widest text-titanium/60">
          <span>
            ข้อ {stepIndex + 1} / {STEPS.length}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-pulse-amber"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {finderState === "calculating" ? (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Loader2 className="animate-spin text-pulse-amber" size={32} />
            <p className="mt-5 font-display text-lg text-bone">
              กำลังจับคู่จักรยานที่เหมาะกับคุณ...
            </p>
            <p className="mt-1.5 font-mono text-xs text-titanium/60">
              คำนวณจากเส้นทาง งบประมาณ ไซซ์ และประสบการณ์
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
              {step.title}
            </h2>
            <p className="mt-2 text-sm text-titanium">{step.sub}</p>

            <div className="mt-8">
              {step.id === "terrain" && (
                <OptionGrid
                  options={TERRAIN_OPTS}
                  selected={answers.terrain}
                  onSelect={(v) => setAnswers((a) => ({ ...a, terrain: v }))}
                />
              )}
              {step.id === "distance" && (
                <OptionGrid
                  options={DISTANCE_OPTS}
                  selected={answers.distance}
                  onSelect={(v) => setAnswers((a) => ({ ...a, distance: v }))}
                />
              )}
              {step.id === "feel" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FEEL_OPTS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers((a) => ({ ...a, feel: opt.value }))}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        answers.feel === opt.value
                          ? "border-pulse-amber bg-pulse-amber/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <p className="font-mono text-[10px] tracking-widest text-volt-cyan">
                        {opt.hint.toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm font-medium text-bone">{opt.label}</p>
                    </button>
                  ))}
                </div>
              )}
              {step.id === "budget" && (
                <OptionGrid
                  options={BUDGET_OPTS}
                  selected={answers.budget}
                  onSelect={(v) => setAnswers((a) => ({ ...a, budget: v }))}
                />
              )}
              {step.id === "height" && (
                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={130}
                    max={210}
                    placeholder="เช่น 172"
                    value={answers.heightCm ?? ""}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        heightCm: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-carbon-900 px-5 py-4 text-lg text-bone outline-none focus:border-pulse-amber"
                  />
                  <p className="mt-2 font-mono text-[11px] text-titanium/50">
                    หน่วยเซนติเมตร (130–210 ซม.)
                  </p>
                </div>
              )}
              {step.id === "experience" && (
                <OptionGrid
                  options={EXPERIENCE_OPTS}
                  selected={answers.experience}
                  onSelect={(v) => setAnswers((a) => ({ ...a, experience: v }))}
                />
              )}
              {step.id === "special" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SPECIAL_OPTS.map((opt) => {
                    const active = answers.special.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setAnswers((a) => ({
                            ...a,
                            special: active
                              ? a.special.filter((s) => s !== opt.value)
                              : [...a.special, opt.value],
                          }))
                        }
                        className={`rounded-xl border p-4 text-left text-sm font-medium transition-colors ${
                          active
                            ? "border-pulse-amber bg-pulse-amber/10 text-bone"
                            : "border-white/10 text-bone hover:border-white/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-9 flex items-center justify-between">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-titanium hover:text-bone"
              >
                <ArrowLeft size={15} />
                {stepIndex === 0 ? "ออกจาก Finder" : "ย้อนกลับ"}
              </button>
              <div className="flex items-center gap-4">
                {!step.required && (
                  <button
                    onClick={skipStep}
                    className="text-sm text-titanium hover:text-bone"
                  >
                    ข้ามข้อนี้
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="flex items-center gap-1.5 rounded-full bg-pulse-amber px-6 py-3 text-sm font-semibold text-void transition-transform hover:scale-105"
                >
                  {stepIndex === STEPS.length - 1 ? "ดูผลลัพธ์" : "ถัดไป"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function OptionGrid<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`rounded-xl border p-4 text-left text-sm font-medium transition-colors ${
            selected === opt.value
              ? "border-pulse-amber bg-pulse-amber/10 text-bone"
              : "border-white/10 text-bone hover:border-white/30"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
