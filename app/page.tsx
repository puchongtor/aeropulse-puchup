"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppView, Bike, FinderAnswers, MatchResult } from "@/lib/types";
import { BIKES } from "@/lib/data";
import { getRecommendations } from "@/lib/finder-engine";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Finder from "@/components/Finder";
import Results from "@/components/Results";
import ProductDetail from "@/components/ProductDetail";
import CatalogPage from "@/components/CatalogPage";
import ComparePage from "@/components/ComparePage";
import CompareDrawer from "@/components/CompareDrawer";
import StockCheck from "@/components/StockCheck";
import LineHandoff from "@/components/LineHandoff";
import Footer, { HowItWorks, FAQSection } from "@/components/Footer";
import FloatingBadge from "@/components/FloatingBadge";
import DemoRibbon from "@/components/DemoRibbon";
import PersonaLauncher from "@/components/PersonaLauncher";

export default function AeroPulseSite() {
  const [view, setView] = useState<AppView>("home");
  const [answers, setAnswers] = useState<FinderAnswers | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [contactBike, setContactBike] = useState<Bike | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);

  const compareBikes = BIKES.filter((b) => compareIds.includes(b.id));

  function navigate(v: AppView) {
    setView(v);
    if (v !== "product") setShowCatalog(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFinderComplete(a: FinderAnswers) {
    setAnswers(a);
    const matches = getRecommendations(a);
    setResults(matches);
    navigate("results");
  }

  function toggleCompare(bike: Bike) {
    setCompareIds((prev) => {
      if (prev.includes(bike.id)) return prev.filter((id) => id !== bike.id);
      if (prev.length >= 3) return prev;
      return [...prev, bike.id];
    });
  }

  function openDetail(bike: Bike) {
    setSelectedBike(bike);
    navigate("product");
  }

  function goStockCheck(bike?: Bike) {
    if (bike) setSelectedBike(bike);
    navigate("stock");
  }

  function goContact(bike?: Bike) {
    setContactBike(bike ?? selectedBike ?? null);
    navigate("contact");
  }

  return (
    <div className="min-h-screen bg-void text-bone">
      <DemoRibbon />
      <Header view={view} onNavigate={navigate} compareCount={compareIds.length} />

      <AnimatePresence mode="wait">
        <motion.main
          key={`${view}-${showCatalog}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {view === "home" && !showCatalog && (
            <>
              <Hero
                onStartFinder={() => navigate("finder")}
                onBrowseCatalog={() => setShowCatalog(true)}
              />
              <TrustStrip />
              <HowItWorks onStartFinder={() => navigate("finder")} />
              <FAQSection />
            </>
          )}

          {view === "home" && showCatalog && (
            <CatalogPage
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
              onOpenDetail={openDetail}
              onCheckStock={goStockCheck}
            />
          )}

          {view === "finder" && (
            <Finder onComplete={handleFinderComplete} onExit={() => navigate("home")} />
          )}

          {view === "results" && answers && (
            <Results
              answers={answers}
              results={results}
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
              onOpenDetail={openDetail}
              onCheckStock={goStockCheck}
              onRestart={() => navigate("finder")}
              onBrowseCatalog={() => {
                setShowCatalog(true);
                navigate("home");
              }}
            />
          )}

          {view === "product" && selectedBike && (
            <ProductDetail
              bike={selectedBike}
              inCompare={compareIds.includes(selectedBike.id)}
              compareDisabled={compareIds.length >= 3}
              onBack={() => (answers ? navigate("results") : navigate("home"))}
              onToggleCompare={toggleCompare}
              onCheckStock={goStockCheck}
              onGoContact={goContact}
            />
          )}

          {view === "compare" && (
            <ComparePage
              items={compareBikes}
              onRemove={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
              onGoFinder={() => navigate("finder")}
              onGoContact={goContact}
            />
          )}

          {view === "stock" && (
            <StockCheck preselected={selectedBike} onGoContact={goContact} />
          )}

          {view === "contact" && (
            <LineHandoff bike={contactBike} />
          )}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={navigate} />
      <CompareDrawer
        items={compareBikes}
        onRemove={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
        onOpenCompare={() => navigate("compare")}
      />
      {/* Two entry points into the same Finder Engine: the header/hero button
          opens the structured 7-question Finder (SMART UI); this avatar opens
          the free-text AeroPulse Expert chat (AI CHAT). Both call
          handleFinderComplete -> getRecommendations -> Results. */}
      <PersonaLauncher onComplete={handleFinderComplete} />
      <FloatingBadge />
    </div>
  );
}
