"use client";

import { motion } from "framer-motion";
import { RefreshCcw, Info } from "lucide-react";
import { Bike, FinderAnswers, MatchResult } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ResultsProps {
  answers: FinderAnswers;
  results: MatchResult[];
  compareIds: string[];
  onToggleCompare: (bike: Bike) => void;
  onOpenDetail: (bike: Bike) => void;
  onCheckStock: (bike: Bike) => void;
  onRestart: () => void;
  onBrowseCatalog: () => void;
}

const TERRAIN_LABEL: Record<string, string> = {
  city: "ในเมือง",
  road: "ถนนใหญ่",
  gravel: "กรวด/ลูกรัง",
  track: "สนามแข่ง",
};
const FEEL_LABEL: Record<string, string> = {
  aero: "เร็วที่สุด",
  endurance: "สบายทั้งวัน",
  versatile: "อเนกประสงค์",
  assisted: "มีไฟฟ้าช่วย",
};
const BUDGET_LABEL: Record<string, string> = {
  under100: "ต่ำกว่า 100k",
  "100to200": "100k–200k",
  "200to350": "200k–350k",
  over350: "350k ขึ้นไป",
};

export default function Results({
  answers,
  results,
  compareIds,
  onToggleCompare,
  onOpenDetail,
  onCheckStock,
  onRestart,
  onBrowseCatalog,
}: ResultsProps) {
  if (results.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-mono text-xs tracking-widest text-titanium/60">
          NO-MATCH STATE
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold text-bone">
          ยังไม่พบรุ่นที่ตรงเงื่อนไขทั้งหมด
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-titanium">
          ลองขยายงบประมาณ หรือปรับความต้องการพิเศษดู — หรือให้ผู้เชี่ยวชาญของเราช่วยแนะนำโดยตรงทาง LINE
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-full bg-pulse-amber px-6 py-3 text-sm font-semibold text-void"
          >
            <RefreshCcw size={15} /> ทำแบบสอบถามใหม่
          </button>
          <button
            onClick={onBrowseCatalog}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-bone"
          >
            ดูรุ่นทั้งหมดแทน
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs tracking-widest text-volt-cyan">
          SMART FINDER RESULTS
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-bone sm:text-4xl">
          3 รุ่นที่เหมาะกับคุณที่สุด
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {answers.terrain && (
            <Chip label={`เส้นทาง: ${TERRAIN_LABEL[answers.terrain]}`} />
          )}
          {answers.feel && <Chip label={`ความรู้สึก: ${FEEL_LABEL[answers.feel]}`} />}
          {answers.budget && <Chip label={`งบ: ${BUDGET_LABEL[answers.budget]}`} />}
          {answers.heightCm && <Chip label={`ส่วนสูง: ${answers.heightCm} ซม.`} />}
        </div>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {results.map((r) => (
          <ProductCard
            key={r.bike.id}
            bike={r.bike}
            badge={r.badge}
            matchScore={r.score}
            reasons={r.reasons}
            inCompare={compareIds.includes(r.bike.id)}
            compareDisabled={compareIds.length >= 3}
            onToggleCompare={onToggleCompare}
            onOpenDetail={onOpenDetail}
            onCheckStock={onCheckStock}
          />
        ))}
      </div>

      <div className="mt-10 flex items-start gap-2 rounded-xl border border-white/10 bg-carbon-900/60 p-4 text-xs leading-relaxed text-titanium/80">
        <Info size={15} className="mt-0.5 shrink-0 text-titanium/60" />
        <p>
          ผลลัพธ์นี้คำนวณจากคำตอบของคุณโดยระบบ Smart Finder ซึ่งเป็นการแนะนำเบื้องต้น
          ไม่ใช่คำแนะนำที่แม่นยำ 100% ไซซ์ที่แสดงเป็นการประเมินจากส่วนสูงเท่านั้น
          กรุณาให้ช่างฟิตติ้งของร้านยืนยันไซซ์ที่แน่นอนอีกครั้งก่อนสั่งซื้อ
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 text-sm text-titanium hover:text-bone"
        >
          <RefreshCcw size={14} /> ทำแบบสอบถามใหม่
        </button>
      </div>
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-titanium">
      {label}
    </span>
  );
}
