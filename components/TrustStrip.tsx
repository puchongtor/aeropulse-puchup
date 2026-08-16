"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Wind, Ruler, Headset } from "lucide-react";
import { LIFESTYLE_IMAGES } from "@/lib/data";
import GeneratedImage from "./GeneratedImage";

const TRUST_SIGNALS = [
  {
    icon: Wind,
    title: "ทดสอบ Wind Tunnel จริง",
    desc: "ทุกรุ่นในสาย Aero ผ่านการวัดค่า CdA จากอุโมงค์ลมก่อนวางจำหน่าย",
  },
  {
    icon: Ruler,
    title: "ฟิตติ้งโดยผู้เชี่ยวชาญ",
    desc: "คำแนะนำไซซ์จาก Smart Finder เป็นจุดเริ่มต้น ช่างของเรายืนยันอีกครั้งเสมอ",
  },
  {
    icon: ShieldCheck,
    title: "รับประกันเฟรมตลอดอายุการใช้งาน",
    desc: "ครอบคลุมความเสียหายจากการผลิต สำหรับเฟรมคาร์บอนทุกรุ่น",
  },
  {
    icon: Headset,
    title: "ที่ปรึกษาส่วนตัวทาง LINE",
    desc: "คุยตรงกับผู้เชี่ยวชาญร้าน ไม่ใช่แชทบอทอัตโนมัติ",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-white/5 bg-carbon-900/40">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_SIGNALS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <s.icon size={20} className="text-pulse-amber" strokeWidth={1.75} />
              <h3 className="mt-3 font-display text-sm font-semibold text-bone">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-titanium">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold text-bone">
            จากสตูดิโอของเรา
          </h2>
          <span className="font-mono text-[11px] tracking-widest text-titanium/50">
            FIELD &amp; STUDIO
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {LIFESTYLE_IMAGES.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[4/5] w-56 shrink-0 overflow-hidden rounded-xl sm:w-64"
            >
              <GeneratedImage
                prompt={img.prompt}
                alt={img.caption}
                width={520}
                height={650}
                className="h-full w-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-xs leading-snug text-bone">
                {img.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
