"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, X, Sparkles, ArrowRight } from "lucide-react";
import { FinderAnswers } from "@/lib/types";
import { EMPTY_ANSWERS } from "@/lib/finder-engine";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIExpertChatProps {
  onClose: () => void;
  onComplete: (answers: FinderAnswers) => void;
}

const OPENING_MESSAGE =
  "สวัสดีครับ ผม AeroPulse Expert ผมช่วยคุณเลือกจักรยานได้ครับ — ไม่แน่ใจว่าควรเลือกแบบไหน? บอกผมได้เลยว่าคุณปั่นที่ไหน งบเท่าไร และต้องการอะไร";

export default function AIExpertChat({ onClose, onComplete }: AIExpertChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [answers, setAnswers] = useState<FinderAnswers>(EMPTY_ANSWERS);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const filledCount = Object.entries(answers).filter(([k, v]) =>
    k === "special" ? false : v !== null
  ).length;

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const nextHistory: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextHistory);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai-expert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: nextHistory, currentAnswers: answers }),
      });
      const data = await res.json();
      setAnswers(data.answers ?? answers);
      setReady(Boolean(data.readyForResults));
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ขอโทษครับ ระบบขัดข้องชั่วคราว ลองพิมพ์อีกครั้งได้ไหมครับ" },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-24 right-5 z-40 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/12 bg-carbon-900 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
      style={{ height: "min(560px, 78vh)" }}
    >
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
        <div className="relative h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-pulse-amber to-volt-cyan p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-carbon-900">
            <Sparkles size={15} className="text-pulse-amber" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-bone">AeroPulse Expert</p>
          <p className="text-[11px] text-titanium">
            {filledCount > 0 ? `เก็บข้อมูลได้ ${filledCount}/6 ข้อ` : "ผู้เชี่ยวชาญจักรยาน AI"}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="ปิดแชท"
          className="rounded-full p-1.5 text-titanium hover:bg-white/10 hover:text-bone"
        >
          <X size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-pulse-amber text-void"
                  : "rounded-bl-sm bg-white/8 text-bone"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-titanium"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {ready && (
        <div className="border-t border-white/8 px-4 py-3">
          <button
            onClick={() => onComplete(answers)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-pulse-amber py-3 text-sm font-semibold text-void hover:scale-[1.02] transition-transform"
          >
            ดูผลลัพธ์ 3 รุ่นที่เหมาะกับคุณ <ArrowRight size={15} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-white/8 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="ลองพิมพ์ได้เลย เช่น งบ 150,000 อยากปั่นทางไกล"
          className="flex-1 rounded-full border border-white/12 bg-carbon-800 px-4 py-2.5 text-[13px] text-bone outline-none placeholder:text-titanium/60 focus:border-pulse-amber"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          aria-label="ส่งข้อความ"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pulse-amber text-void disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </div>
    </motion.div>
  );
}
