import { Wallet, Settings2, Rocket, FileCheck, PartyPopper } from "lucide-react";
import { LaunchpadStep } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: LaunchpadStep;
}

const STEPS = [
  { id: "wallet", label: "Connect", icon: Wallet },
  { id: "token", label: "Token", icon: Settings2 },
  { id: "presale", label: "Presale", icon: Rocket },
  { id: "review", label: "Review", icon: FileCheck },
  { id: "published", label: "Published", icon: PartyPopper },
] as const;

export function LaunchpadStepper({ currentStep }: Props) {
  if (currentStep === "public_preview") return null;

  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full bg-[#161616] border-b border-border p-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-between min-w-[500px] max-w-3xl mx-auto">
        {STEPS.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  isActive ? "border-primary bg-primary/20 text-primary" : 
                  isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-white/5 text-muted"
                )}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span className={cn("text-xs font-bold", isActive || isCompleted ? "text-foreground" : "text-muted")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
