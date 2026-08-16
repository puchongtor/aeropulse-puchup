"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function FloatingBadge() {
  return (
    <motion.a
      href="https://puchup.com"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.04 }}
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-carbon-900/80 px-4 py-2 text-xs font-medium text-titanium backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF7A33]">
        <Rocket size={11} className="text-white" strokeWidth={2.5} />
      </span>
      Powered by PuchUp Engine
    </motion.a>
  );
}
