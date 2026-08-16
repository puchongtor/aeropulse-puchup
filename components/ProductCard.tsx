"use client";

import { motion } from "framer-motion";
import { Check, Plus, Gauge } from "lucide-react";
import { Bike } from "@/lib/types";
import { formatTHB } from "@/lib/finder-engine";
import GeneratedImage from "./GeneratedImage";

interface ProductCardProps {
  bike: Bike;
  badge?: "BEST FIT" | "BEST VALUE" | "PERFORMANCE PICK";
  matchScore?: number;
  reasons?: string[];
  inCompare?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: (bike: Bike) => void;
  onOpenDetail?: (bike: Bike) => void;
  onCheckStock?: (bike: Bike) => void;
}

const BADGE_STYLE: Record<string, string> = {
  "BEST FIT": "bg-pulse-amber text-void",
  "BEST VALUE": "bg-volt-cyan text-void",
  "PERFORMANCE PICK": "bg-bone text-void",
};

export default function ProductCard({
  bike,
  badge,
  matchScore,
  reasons,
  inCompare,
  compareDisabled,
  onToggleCompare,
  onOpenDetail,
  onCheckStock,
}: ProductCardProps) {
  const anyInStock = bike.sizes.some((s) => s.inStock);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-carbon-900/60 transition-colors hover:border-white/20"
    >
      <button
        onClick={() => onOpenDetail?.(bike)}
        className="relative aspect-[4/3] w-full overflow-hidden text-left"
      >
        <GeneratedImage
          prompt={bike.heroImagePrompt}
          alt={bike.name}
          width={800}
          height={600}
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${BADGE_STYLE[badge]}`}
          >
            {badge}
          </span>
        )}
        {!anyInStock && (
          <span className="absolute right-3 top-3 rounded-full bg-void/80 px-2.5 py-1 text-[10px] font-semibold text-titanium">
            พรีออเดอร์
          </span>
        )}
        {typeof matchScore === "number" && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-void/80 px-2.5 py-1 font-mono text-[10px] text-volt-cyan backdrop-blur">
            <Gauge size={11} /> MATCH {matchScore}%
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] tracking-widest text-titanium/60">
          {bike.series.toUpperCase()}
        </p>
        <button
          onClick={() => onOpenDetail?.(bike)}
          className="mt-1 text-left font-display text-lg font-semibold text-bone hover:text-pulse-amber"
        >
          {bike.name}
        </button>
        <p className="mt-1 text-sm text-titanium">{bike.tagline}</p>

        {reasons && reasons.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {reasons.slice(0, 2).map((r) => (
              <li
                key={r}
                className="flex items-start gap-1.5 text-xs leading-snug text-titanium/90"
              >
                <Check size={12} className="mt-0.5 shrink-0 text-volt-cyan" />
                {r}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between font-mono text-xs text-titanium/70">
          <span>{bike.weightKg} kg</span>
          <span>Aero {bike.aeroRating}/100</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-bone">
            {formatTHB(bike.priceTHB)}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onCheckStock?.(bike)}
            className="flex-1 rounded-full border border-white/15 py-2.5 text-xs font-semibold text-bone transition-colors hover:border-white/40"
          >
            เช็คสต็อก
          </button>
          <button
            onClick={() => onToggleCompare?.(bike)}
            disabled={compareDisabled && !inCompare}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition-colors ${
              inCompare
                ? "bg-pulse-amber text-void"
                : compareDisabled
                ? "cursor-not-allowed bg-white/5 text-titanium/40"
                : "bg-white/10 text-bone hover:bg-white/20"
            }`}
          >
            {inCompare ? <Check size={13} /> : <Plus size={13} />}
            {inCompare ? "เพิ่มแล้ว" : "เปรียบเทียบ"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
