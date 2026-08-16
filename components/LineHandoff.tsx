"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Copy, Check, ExternalLink } from "lucide-react";
import { Bike } from "@/lib/types";
import { formatTHB } from "@/lib/finder-engine";
import { BRAND } from "@/lib/data";

interface LineHandoffProps {
  bike: Bike | null;
  sizeLabel?: string;
}

// Replace with the shop's real LINE OA basic ID (e.g. "@aeropulse").
// When unset/placeholder, the UI falls back to "copy message" instead of
// deep-linking, so the flow never dead-ends.
const LINE_OA_ID = process.env.NEXT_PUBLIC_LINE_OA_ID || "";

function buildMessage(bike: Bike | null, sizeLabel?: string): string {
  const lines = [
    `สวัสดีค่ะ/ครับ สนใจสอบถามจาก ${BRAND.name} (${BRAND.domain})`,
  ];
  if (bike) {
    lines.push("");
    lines.push(`รุ่นที่สนใจ: ${bike.name} (${bike.series})`);
    lines.push(`ราคา: ${formatTHB(bike.priceTHB)}`);
    if (sizeLabel) lines.push(`ไซซ์ที่ระบบแนะนำ: ${sizeLabel} (รอช่างยืนยันอีกครั้ง)`);
    lines.push(`กรุ๊ปเซ็ต: ${bike.groupset}`);
  }
  lines.push("");
  lines.push("รบกวนขอข้อมูลสต็อกและนัดฟิตติ้งด้วยค่ะ/ครับ");
  return lines.join("\n");
}

export default function LineHandoff({ bike, sizeLabel }: LineHandoffProps) {
  const [copied, setCopied] = useState(false);
  const message = useMemo(() => buildMessage(bike, sizeLabel), [bike, sizeLabel]);

  const lineUrl = LINE_OA_ID
    ? `https://line.me/R/oaMessage/${encodeURIComponent(LINE_OA_ID)}/?${encodeURIComponent(message)}`
    : null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-volt-cyan">LINE HANDOFF</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-bone">
        ส่งข้อความสรุปให้ร้านทาง LINE
      </h1>
      <p className="mt-3 text-sm text-titanium">
        ระบบสร้างข้อความสรุปสเปกที่คุณเลือกไว้ให้อัตโนมัติ กดปุ่มด้านล่างเพื่อเปิด LINE
        พร้อมข้อความนี้ ทีมงานของเราจะตอบกลับเพื่อยืนยันสต็อกและนัดฟิตติ้งจริง
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-carbon-900/60 p-5">
        <p className="mb-2 font-mono text-[11px] tracking-widest text-titanium/50">
          MESSAGE PREVIEW
        </p>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-bone">
          {message}
        </pre>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {lineUrl ? (
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3.5 text-sm font-semibold text-white hover:scale-[1.02] transition-transform"
          >
            <MessageCircle size={17} /> เปิด LINE เพื่อส่งข้อความ
            <ExternalLink size={13} />
          </a>
        ) : (
          <div className="flex-1 rounded-full border border-clay/40 bg-clay/10 px-6 py-3.5 text-center text-xs text-clay">
            ยังไม่ได้ตั้งค่า LINE OA ID — ใช้ปุ่ม &ldquo;คัดลอกข้อความ&rdquo; แล้วส่งเองในแอด LINE ของร้านแทน
          </div>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-bone hover:border-white/40"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "คัดลอกแล้ว" : "คัดลอกข้อความ"}
        </button>
      </div>

      <p className="mt-6 font-mono text-[11px] text-titanium/40">
        * นี่คือ Demo ระบบ LINE Handoff เท่านั้น ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์จริง
        การเชื่อมต่อ LINE OA จริงต้องตั้งค่า NEXT_PUBLIC_LINE_OA_ID เป็น Basic ID ของร้าน
      </p>
    </section>
  );
}
