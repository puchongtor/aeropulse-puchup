"use client";

export default function DemoRibbon() {
  return (
    <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#FF7A33] px-4 py-1.5 text-center font-mono text-[10px] font-semibold tracking-widest text-white sm:text-[11px]">
      <span>PUCHUP DEMO · CONCEPT WEBSITE</span>
      <span className="hidden opacity-70 sm:inline">
        — ราคา สต็อก และผลลัพธ์ AI ทั้งหมดเป็นข้อมูลตัวอย่างเพื่อสาธิตระบบเท่านั้น
      </span>
    </div>
  );
}
