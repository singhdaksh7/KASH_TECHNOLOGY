import { Home, TrendingUp, ArrowRightLeft, Wallet, User } from "lucide-react";
import { ExoraScreen } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  currentScreen: ExoraScreen;
  onNavigate: (screen: ExoraScreen) => void;
}

export function ExoraBottomNavigation({ currentScreen, onNavigate }: Props) {
  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "markets" as const, label: "Markets", icon: TrendingUp },
    { id: "trade" as const, label: "Trade", icon: ArrowRightLeft },
    { id: "wallet" as const, label: "Wallet", icon: Wallet },
    { id: "profile" as const, label: "User", icon: User },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-lg border-t border-border grid grid-cols-5 gap-1 z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            aria-label={`Navigate to ${tab.label}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
              isActive ? "text-primary" : "text-muted hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[8px] uppercase font-bold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
