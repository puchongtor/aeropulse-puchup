"use client";

import { motion } from "framer-motion";
import { ArrowRight, Wind } from "lucide-react";
import { BRAND } from "@/lib/data";
import GeneratedImage from "./GeneratedImage";

interface HeroProps {
  onStartFinder: () => void;
  onBrowseCatalog: () => void;
}

// Ambient wind lines: thin horizontal strokes that drift, echoing an aero
// wind-tunnel smoke trace. Pure decoration, respects reduced motion.
function WindLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      {[18, 34, 50, 66, 82].map((top, i) => (
        <motion.div
          key={top}
          className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-volt-cyan/40 to-transparent"
          style={{ top: `${top}%` }}
          initial={{ x: "-15%" }}
          animate={{ x: "15%" }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ onStartFinder, onBrowseCatalog }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0">
        <GeneratedImage
          prompt="Matte black aero road bicycle in a dark wind-tunnel studio, amber rim light, low angle hero shot, cinematic, ultra-detailed, no text"
          alt=""
          width={1600}
          height={1000}
          className="h-full w-full opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/40" />
      </div>
      <WindLines />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-volt-cyan"
        >
          <Wind size={13} />
          SSS-TIER PERFORMANCE STUDIO
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-bone sm:text-6xl"
        >
          {BRAND.taglineTh}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-titanium sm:text-lg"
        >
          ตอบคำถาม 7 ข้อ ให้ระบบ Smart Finder จับคู่คุณกับจักรยาน 3 รุ่นที่เหมาะที่สุด
          — เปรียบเทียบ เช็คสต็อกจริง แล้วคุยกับผู้เชี่ยวชาญของเราทาง LINE ได้ทันที
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={onStartFinder}
            className="group flex items-center gap-2 rounded-full bg-pulse-amber px-7 py-3.5 text-sm font-semibold text-void transition-transform hover:scale-105"
          >
            เริ่ม Smart Finder
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={onBrowseCatalog}
            className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-bone transition-colors hover:border-white/40"
          >
            ดูรุ่นทั้งหมด
          </button>
        </motion.div>

        <p className="mt-8 max-w-xl font-mono text-[11px] leading-relaxed text-titanium/50">
          * เว็บไซต์นี้เป็น Demo สำหรับสาธิตระบบเท่านั้น ราคาและสต็อกเป็นข้อมูลตัวอย่าง
          คำแนะนำไซซ์เป็นการประเมินเบื้องต้น กรุณาให้ช่างฟิตติ้งยืนยันอีกครั้งก่อนสั่งซื้อจริง
        </p>
      </div>
    </section>
  );
}
