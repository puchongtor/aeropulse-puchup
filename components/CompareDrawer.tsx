"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompareArrows } from "lucide-react";
import { Bike } from "@/lib/types";

interface CompareDrawerProps {
  items: Bike[];
  onRemove: (id: string) => void;
  onOpenCompare: () => void;
}

export default function CompareDrawer({ items, onRemove, onOpenCompare }: CompareDrawerProps) {
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon-900/95 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3.5">
            <div className="flex items-center gap-2 text-sm text-titanium">
              <GitCompareArrows size={16} className="text-pulse-amber" />
              เปรียบเทียบ ({items.length}/3)
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {items.map((b) => (
                <span
                  key={b.id}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pl-3 pr-1.5 text-xs text-bone"
                >
                  {b.name}
                  <button
                    onClick={() => onRemove(b.id)}
                    aria-label={`นำ ${b.name} ออกจากการเปรียบเทียบ`}
                    className="rounded-full p-0.5 hover:bg-white/20"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={onOpenCompare}
              disabled={items.length < 2}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                items.length < 2
                  ? "cursor-not-allowed bg-white/10 text-titanium/40"
                  : "bg-pulse-amber text-void hover:scale-105"
              } transition-transform`}
            >
              ดูตารางเปรียบเทียบ
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
