"use client";

import { X, MessageCircle } from "lucide-react";
import { Bike } from "@/lib/types";
import { formatTHB } from "@/lib/finder-engine";
import GeneratedImage from "./GeneratedImage";

interface ComparePageProps {
  items: Bike[];
  onRemove: (id: string) => void;
  onGoFinder: () => void;
  onGoContact: (bike?: Bike) => void;
}

const ROWS: { label: string; get: (b: Bike) => string }[] = [
  { label: "ราคา", get: (b) => formatTHB(b.priceTHB) },
  { label: "น้ำหนัก", get: (b) => `${b.weightKg} kg` },
  { label: "Aero Rating", get: (b) => `${b.aeroRating}/100` },
  { label: "Comfort Rating", get: (b) => `${b.comfortRating}/100` },
  { label: "กรุ๊ปเซ็ต", get: (b) => b.groupset },
  { label: "เฟรม", get: (b) => b.frame },
  {
    label: "สต็อก",
    get: (b) => (b.sizes.some((s) => s.inStock) ? "มีสินค้าพร้อมส่ง" : "พรีออเดอร์"),
  },
];

export default function ComparePage({ items, onRemove, onGoFinder, onGoContact }: ComparePageProps) {
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-mono text-xs tracking-widest text-titanium/60">
          EMPTY COMPARE STATE
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold text-bone">
          ยังไม่มีรุ่นที่เลือกเปรียบเทียบ
        </h2>
        <p className="mt-3 text-sm text-titanium">
          เลือกได้สูงสุด 3 รุ่นจากผลลัพธ์ Smart Finder หรือหน้ารวมรุ่นทั้งหมด
        </p>
        <button
          onClick={onGoFinder}
          className="mt-8 rounded-full bg-pulse-amber px-6 py-3 text-sm font-semibold text-void"
        >
          เริ่ม Smart Finder
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 pb-32">
      <p className="font-mono text-xs tracking-widest text-volt-cyan">COMPARE</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-bone sm:text-4xl">
        เปรียบเทียบ {items.length} รุ่น
      </h1>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 [scrollbar-width:thin]">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-carbon-900/60">
              <th className="w-40 p-4 font-mono text-[11px] font-normal text-titanium/60">
                สเปก
              </th>
              {items.map((b) => (
                <th key={b.id} className="min-w-[180px] p-4 align-top">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <GeneratedImage
                      prompt={b.heroImagePrompt}
                      alt={b.name}
                      width={400}
                      height={300}
                      className="h-full w-full"
                    />
                    <button
                      onClick={() => onRemove(b.id)}
                      aria-label={`นำ ${b.name} ออก`}
                      className="absolute right-1.5 top-1.5 rounded-full bg-void/80 p-1.5 text-bone hover:bg-void"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <p className="mt-2 font-display text-sm font-semibold text-bone">
                    {b.name}
                  </p>
                  <button
                    onClick={() => onGoContact(b)}
                    className="mt-2 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-bone hover:bg-white/20"
                  >
                    <MessageCircle size={11} /> ถามร้าน
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}
              >
                <td className="p-4 text-sm font-medium text-titanium">{row.label}</td>
                {items.map((b) => (
                  <td key={b.id} className="p-4 text-sm text-bone">
                    {row.get(b)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-titanium/50 sm:hidden">
        เลื่อนซ้าย-ขวาเพื่อดูรุ่นทั้งหมด →
      </p>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-carbon-900/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm text-titanium">
            พร้อมตัดสินใจแล้วใช่ไหม? คุยกับผู้เชี่ยวชาญของเราได้ทันที
          </span>
          <button
            onClick={() => onGoContact()}
            className="flex items-center gap-2 rounded-full bg-pulse-amber px-6 py-3 text-sm font-semibold text-void hover:scale-105"
          >
            <MessageCircle size={16} /> คุยทาง LINE
          </button>
        </div>
      </div>
    </section>
  );
}
