"use client";

import { useState } from "react";
import { ExoraScreen } from "./types";
import { PhoneFrame } from "../shared/PhoneFrame";
import { ExoraBottomNavigation } from "./ExoraBottomNavigation";
import { HomeScreen } from "./HomeScreen";
import { MarketsScreen } from "./MarketsScreen";
import { TradeScreen } from "./TradeScreen";
import { WalletScreen } from "./WalletScreen";
import { ProfileScreen } from "./ProfileScreen";
import { AnimatePresence, motion } from "framer-motion";

export function ExoraDemo() {
  const [screen, setScreen] = useState<ExoraScreen>("home");

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen onNavigate={setScreen} />;
      case "markets":
        return <MarketsScreen onNavigate={setScreen} />;
      case "trade":
        return <TradeScreen />;
      case "wallet":
        return <WalletScreen />;
      case "profile":
        return <ProfileScreen />;
    }
  };

  return (
    <PhoneFrame>
      <div className="relative w-full h-full flex flex-col bg-[#050505] text-[#e5e2e1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 w-full h-full flex flex-col overflow-hidden relative"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        
        <ExoraBottomNavigation currentScreen={screen} onNavigate={setScreen} />
      </div>
    </PhoneFrame>
  );
}
