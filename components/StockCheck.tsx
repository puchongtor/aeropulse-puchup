"use client";

import { useState } from "react";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { Bike } from "@/lib/types";
import { BIKES } from "@/lib/data";
import { formatTHB } from "@/lib/finder-engine";

interface StockCheckProps {
  preselected: Bike | null;
  onGoContact: (bike: Bike, sizeLabel?: string) => void;
}

export default function StockCheck({ preselected, onGoContact }: StockCheckProps) {
  const [selectedId, setSelectedId] = useState<string>(preselected?.id ?? BIKES[0].id);
  const bike = BIKES.find((b) => b.id === selectedId) ?? BIKES[0];

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-volt-cyan">STOCK CHECK</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-bone sm:text-4xl">
        เช็คสต็อกตามรุ่นและไซซ์
      </h1>
      <p className="mt-3 max-w-xl text-sm text-titanium">
        ข้อมูลสต็อกด้านล่างเป็นข้อมูลสาธิต (Demo) ไม่ใช่สต็อกจริงจากคลังสินค้า
        กรุณายืนยันสต็อกจริงกับร้านทาง LINE ก่อนเดินทางมาหรือสั่งซื้อ
      </p>

      <div className="mt-8">
        <label className="mb-2 block font-mono text-[11px] tracking-widest text-titanium/60">
          เลือกรุ่น
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-carbon-900 px-4 py-3.5 text-sm text-bone outline-none focus:border-pulse-amber sm:w-96"
        >
          {BIKES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {formatTHB(b.priceTHB)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {bike.sizes.map((s) => (
          <div
            key={s.size}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-carbon-900/60 p-4"
          >
            <div>
              <p className="font-display text-base font-semibold text-bone">
                ไซซ์ {s.size}
              </p>
              <p className="font-mono text-[11px] text-titanium/50">
                สูง {s.heightRangeCm[0]}–{s.heightRangeCm[1]} ซม.
              </p>
            </div>
            {s.inStock ? (
              <span className="flex items-center gap-1.5 rounded-full bg-volt-cyan/15 px-3 py-1.5 text-xs font-semibold text-volt-cyan">
                <CheckCircle2 size={13} /> พร้อมส่ง
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-clay/15 px-3 py-1.5 text-xs font-semibold text-clay">
                <Clock size={13} /> {s.etaDays} วัน
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-9 flex flex-wrap gap-3">
        <button
          onClick={() => onGoContact(bike)}
          className="flex items-center gap-2 rounded-full bg-pulse-amber px-6 py-3.5 text-sm font-semibold text-void hover:scale-105"
        >
          <MessageCircle size={16} /> สอบถาม / จองผ่าน LINE
        </button>
      </div>
    </section>
  );
}
