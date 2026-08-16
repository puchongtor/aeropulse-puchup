"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ListChecks, Sparkles, Scale3d, MessageCircle } from "lucide-react";
import { AppView } from "@/lib/types";
import { BRAND } from "@/lib/data";

const STEPS = [
  { icon: ListChecks, title: "ตอบ 7 คำถาม", desc: "เกี่ยวกับเส้นทาง งบประมาณ และประสบการณ์การปั่น" },
  { icon: Sparkles, title: "รับ 3 รุ่นที่ใช่", desc: "BEST FIT, BEST VALUE และ PERFORMANCE PICK พร้อมเหตุผล" },
  { icon: Scale3d, title: "เปรียบเทียบ & เช็คสต็อก", desc: "ดูสเปกเทียบกันแบบตาราง พร้อมสถานะสต็อกตามไซซ์" },
  { icon: MessageCircle, title: "คุยกับผู้เชี่ยวชาญ", desc: "ส่งสรุปสเปกที่เลือกเข้า LINE ของร้านได้ทันที" },
];

const FAQS = [
  {
    q: "คำแนะนำไซซ์จาก Smart Finder แม่นยำแค่ไหน?",
    a: "เป็นการประเมินเบื้องต้นจากส่วนสูงเท่านั้น ไม่ใช่คำแนะนำที่แม่นยำ 100% ช่างฟิตติ้งของร้านจะยืนยันไซซ์ที่แน่นอนอีกครั้งก่อนสั่งซื้อจริง",
  },
  {
    q: "ราคาและสต็อกที่แสดงเป็นข้อมูลจริงหรือไม่?",
    a: "เว็บไซต์นี้เป็น Demo สำหรับสาธิตระบบเท่านั้น ราคาและสต็อกทั้งหมดเป็นข้อมูลตัวอย่าง กรุณายืนยันราคาและสต็อกจริงกับร้านทาง LINE",
  },
  {
    q: "เปรียบเทียบได้สูงสุดกี่รุ่น?",
    a: "เลือกได้สูงสุด 3 รุ่นพร้อมกัน ระบบจะแสดงตารางเปรียบเทียบสเปกแบบเคียงข้างกันให้อัตโนมัติ",
  },
  {
    q: "ถ้าไม่มีรุ่นที่ตรงกับที่ต้องการเลยจะทำอย่างไร?",
    a: "ลองขยายงบประมาณหรือปรับความต้องการพิเศษในแบบสอบถาม หรือติดต่อผู้เชี่ยวชาญของร้านโดยตรงทาง LINE เพื่อขอคำแนะนำเฉพาะบุคคล",
  },
];

export function HowItWorks({ onStartFinder }: { onStartFinder: () => void }) {
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold text-bone">
            Smart Finder ทำงานอย่างไร
          </h2>
          <button
            onClick={onStartFinder}
            className="hidden text-sm text-pulse-amber hover:underline sm:inline"
          >
            เริ่มเลย →
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-carbon-900/60 p-5"
            >
              <s.icon size={20} className="text-pulse-amber" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-sm font-semibold text-bone">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-titanium">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-xl font-semibold text-bone">
          คำถามที่พบบ่อย
        </h2>
        <div className="mt-6 divide-y divide-white/10">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="text-sm font-medium text-bone">{f.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-titanium transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="pb-4 text-sm leading-relaxed text-titanium">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Footer({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  return (
    <footer className="px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg font-semibold text-bone">
            AERO<span className="text-pulse-amber">PULSE</span>
          </p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-titanium/60">
            {BRAND.domain} — {BRAND.positioning}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-titanium">
          <button onClick={() => onNavigate("finder")} className="hover:text-bone">
            Smart Finder
          </button>
          <button onClick={() => onNavigate("compare")} className="hover:text-bone">
            เปรียบเทียบ
          </button>
          <button onClick={() => onNavigate("stock")} className="hover:text-bone">
            เช็คสต็อก
          </button>
          <button onClick={() => onNavigate("contact")} className="hover:text-bone">
            ติดต่อร้าน
          </button>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl border-t border-white/5 pt-6 font-mono text-[10px] leading-relaxed text-titanium/40">
        เว็บไซต์นี้เป็น Frontend Demo เท่านั้น ไม่มีระบบชำระเงินหรือฐานข้อมูลจริง
        ข้อมูลราคา สต็อก และผลลัพธ์จาก Smart Finder เป็นข้อมูลตัวอย่างเพื่อสาธิตการทำงานของระบบ
      </p>
    </footer>
  );
}
