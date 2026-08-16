"use client";

import { useState } from "react";
import { Bike, BikeCategory } from "@/lib/types";
import { BIKES } from "@/lib/data";
import ProductCard from "./ProductCard";

interface CatalogPageProps {
  compareIds: string[];
  onToggleCompare: (bike: Bike) => void;
  onOpenDetail: (bike: Bike) => void;
  onCheckStock: (bike: Bike) => void;
}

const CATEGORIES: { value: BikeCategory | "all"; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "aero-road", label: "Aero Road" },
  { value: "endurance-road", label: "Endurance" },
  { value: "gravel", label: "Gravel" },
  { value: "time-trial", label: "Time Trial" },
  { value: "urban-performance", label: "Urban" },
  { value: "electric-performance", label: "Electric" },
];

export default function CatalogPage({
  compareIds,
  onToggleCompare,
  onOpenDetail,
  onCheckStock,
}: CatalogPageProps) {
  const [filter, setFilter] = useState<BikeCategory | "all">("all");
  const filtered = filter === "all" ? BIKES : BIKES.filter((b) => b.category === filter);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-volt-cyan">CATALOG</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-bone sm:text-4xl">
        จักรยานทั้งหมดในสตูดิโอ
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              filter === c.value
                ? "border-pulse-amber bg-pulse-amber/10 text-bone"
                : "border-white/10 text-titanium hover:border-white/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((bike) => (
          <ProductCard
            key={bike.id}
            bike={bike}
            inCompare={compareIds.includes(bike.id)}
            compareDisabled={compareIds.length >= 3}
            onToggleCompare={onToggleCompare}
            onOpenDetail={onOpenDetail}
            onCheckStock={onCheckStock}
          />
        ))}
      </div>
    </section>
  );
}
