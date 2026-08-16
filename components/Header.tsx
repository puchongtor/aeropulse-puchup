"use client";

import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { AppView } from "@/lib/types";
import { BRAND } from "@/lib/data";

interface HeaderProps {
  view: AppView;
  onNavigate: (v: AppView) => void;
  compareCount: number;
}

const NAV_ITEMS: { label: string; view: AppView }[] = [
  { label: "หน้าแรก", view: "home" },
  { label: "Smart Finder", view: "finder" },
  { label: "เปรียบเทียบ", view: "compare" },
  { label: "เช็คสต็อก", view: "stock" },
  { label: "ติดต่อร้าน", view: "contact" },
];

// Ambient telemetry readout — a nod to a bike computer, ticking gently so the
// header never feels static. Values are mock/demo, not live sensor data.
function TelemetryTicker() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const cda = (0.176 + (tick % 5) * 0.001).toFixed(3);
  const drag = 87 - (tick % 4);
  const watts = 312 + ((tick * 7) % 40);

  return (
    <div className="hidden items-center gap-5 border-t border-white/5 px-6 py-1.5 font-mono text-[10px] tracking-widest text-titanium/70 md:flex">
      <span>CdA {cda}</span>
      <span className="h-3 w-px bg-white/10" />
      <span>DRAG SAVED {drag}%</span>
      <span className="h-3 w-px bg-white/10" />
      <span>{watts}W AVG</span>
      <span className="ml-auto flex items-center gap-1 text-pulse-amber">
        <Zap size={10} /> LIVE FIT ENGINE
      </span>
    </div>
  );
}

export default function Header({ view, onNavigate, compareCount }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-void/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-left"
        >
          <span className="font-display text-lg font-semibold tracking-tight text-bone">
            AERO<span className="text-pulse-amber">PULSE</span>
          </span>
          <span className="hidden font-mono text-[10px] tracking-widest text-titanium/60 sm:inline">
            {BRAND.domain}
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative text-sm transition-colors ${
                view === item.view
                  ? "text-bone"
                  : "text-titanium hover:text-bone"
              }`}
            >
              {item.label}
              {item.view === "compare" && compareCount > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-pulse-amber text-[10px] font-bold text-void">
                  {compareCount}
                </span>
              )}
              {view === item.view && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-pulse-amber" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("finder")}
            className="hidden rounded-full bg-bone px-5 py-2 text-sm font-semibold text-void transition-transform hover:scale-105 md:inline-block"
          >
            หาจักรยานที่ใช่
          </button>
          <button
            className="text-bone md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="เปิดเมนู"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <TelemetryTicker />

      {mobileOpen && (
        <div className="border-t border-white/5 bg-void px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileOpen(false);
                }}
                className={`flex items-center justify-between text-left text-base ${
                  view === item.view ? "text-pulse-amber" : "text-bone"
                }`}
              >
                {item.label}
                {item.view === "compare" && compareCount > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-pulse-amber text-[11px] font-bold text-void">
                    {compareCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
