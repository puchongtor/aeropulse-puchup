"use client";

import { ArrowLeft, GitCompareArrows, MessageCircle, Ruler } from "lucide-react";
import { Bike } from "@/lib/types";
import { formatTHB } from "@/lib/finder-engine";
import GeneratedImage from "./GeneratedImage";

interface ProductDetailProps {
  bike: Bike;
  inCompare: boolean;
  compareDisabled: boolean;
  onBack: () => void;
  onToggleCompare: (bike: Bike) => void;
  onCheckStock: (bike: Bike) => void;
  onGoContact: (bike: Bike) => void;
}

export default function ProductDetail({
  bike,
  inCompare,
  compareDisabled,
  onBack,
  onToggleCompare,
  onCheckStock,
  onGoContact,
}: ProductDetailProps) {
  const anyInStock = bike.sizes.some((s) => s.inStock);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-1.5 text-sm text-titanium hover:text-bone"
      >
        <ArrowLeft size={15} /> กลับ
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <GeneratedImage
              prompt={bike.heroImagePrompt}
              alt={bike.name}
              width={900}
              height={675}
              className="h-full w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {bike.detailImagePrompts.map((p, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl">
                <GeneratedImage
                  prompt={p}
                  alt={`${bike.name} รายละเอียด ${i + 1}`}
                  width={450}
                  height={450}
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] tracking-widest text-titanium/60">
            {bike.series.toUpperCase()}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
            {bike.name}
          </h1>
          <p className="mt-2 text-base text-titanium">{bike.tagline}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="font-display text-2xl font-semibold text-bone">
              {formatTHB(bike.priceTHB)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                anyInStock
                  ? "bg-volt-cyan/15 text-volt-cyan"
                  : "bg-clay/15 text-clay"
              }`}
            >
              {anyInStock ? "มีไซซ์พร้อมส่ง" : "พรีออเดอร์ทุกไซซ์"}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-6 font-mono text-sm">
            <Stat label="น้ำหนัก" value={`${bike.weightKg} kg`} />
            <Stat label="Aero Rating" value={`${bike.aeroRating}/100`} />
            <Stat label="Comfort Rating" value={`${bike.comfortRating}/100`} />
            <Stat label="กรุ๊ปเซ็ต" value={bike.groupset} />
          </div>

          <div className="mt-6">
            <h2 className="font-display text-sm font-semibold text-bone">
              สเปกเต็ม
            </h2>
            <dl className="mt-3 divide-y divide-white/10">
              {bike.specSheet.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-titanium">{s.label}</dt>
                  <dd className="text-right text-bone">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/10 bg-carbon-900/60 p-4 text-xs leading-relaxed text-titanium/80">
            <Ruler size={15} className="mt-0.5 shrink-0 text-titanium/60" />
            ไซซ์ที่แนะนำจากระบบเป็นการประเมินเบื้องต้นจากส่วนสูงเท่านั้น
            กรุณาให้ช่างฟิตติ้งของร้านยืนยันไซซ์ที่แน่นอนก่อนสั่งซื้อจริง
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onGoContact(bike)}
              className="flex items-center gap-2 rounded-full bg-pulse-amber px-6 py-3.5 text-sm font-semibold text-void hover:scale-105"
            >
              <MessageCircle size={16} /> สอบถามทาง LINE
            </button>
            <button
              onClick={() => onCheckStock(bike)}
              className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-bone hover:border-white/40"
            >
              เช็คสต็อกตามไซซ์
            </button>
            <button
              onClick={() => onToggleCompare(bike)}
              disabled={compareDisabled && !inCompare}
              className={`flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold ${
                inCompare
                  ? "bg-white/20 text-bone"
                  : compareDisabled
                  ? "cursor-not-allowed bg-white/5 text-titanium/40"
                  : "bg-white/10 text-bone hover:bg-white/20"
              }`}
            >
              <GitCompareArrows size={16} />
              {inCompare ? "อยู่ในรายการเปรียบเทียบ" : "เพิ่มเข้าเปรียบเทียบ"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-widest text-titanium/50">{label.toUpperCase()}</p>
      <p className="mt-1 text-bone">{value}</p>
    </div>
  );
}
