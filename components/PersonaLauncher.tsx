"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { FinderAnswers } from "@/lib/types";
import AIExpertChat from "./AIExpertChat";

interface PersonaLauncherProps {
  onComplete: (answers: FinderAnswers) => void;
}

export default function PersonaLauncher({ onComplete }: PersonaLauncherProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4500);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <AIExpertChat key="chat" onClose={() => setOpen(false)} onComplete={onComplete} />
      ) : (
        visible && (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2.5"
          >
            <div className="relative max-w-[220px] rounded-2xl rounded-br-sm border border-pulse-amber/25 bg-gradient-to-br from-[#241A38] to-[#171326] px-4 py-3 text-[12.5px] leading-relaxed text-bone shadow-[0_14px_40px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => setDismissed(true)}
                aria-label="ปิด"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-carbon-900 text-titanium hover:text-bone"
              >
                <X size={11} />
              </button>
              สวัสดีครับ ผม <b className="text-pulse-amber">AeroPulse Expert</b> — ไม่แน่ใจว่าควรเลือกรุ่นไหน? คุยกับผมได้เลยครับ
            </div>

            <button
              onClick={() => setOpen(true)}
              aria-label="เปิดแชทกับ AeroPulse Expert"
              className="relative h-16 w-16 rounded-full p-[3px]"
              style={{
                background:
                  "conic-gradient(from 180deg, #FF7A33, #FFB27A, #2FE6D0, #FF7A33)",
                boxShadow: "0 0 22px rgba(255,122,51,0.5), 0 0 40px rgba(47,230,208,0.22)",
              }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full bg-carbon-900">
                <Sparkles size={22} className="text-pulse-amber" />
              </span>
            </button>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
