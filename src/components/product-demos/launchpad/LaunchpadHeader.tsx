import { Wallet } from "lucide-react";
import { NETWORK_NAME, DUMMY_WALLET_ADDRESS } from "./launchpad-data";

interface Props {
  isConnected: boolean;
}

export function LaunchpadHeader({ isConnected }: Props) {
  return (
    <header className="flex justify-between items-center p-4 border-b border-border bg-[#111]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Rocket className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-sm">Launchpad<span className="text-primary">.io</span></span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          {NETWORK_NAME}
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
            <Wallet className="w-3 h-3" />
            {DUMMY_WALLET_ADDRESS}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-muted px-3 py-1.5 rounded-full text-xs font-bold">
            Not Connected
          </div>
        )}
      </div>
    </header>
  );
}

// Just adding a quick local import for Rocket to make it compile since I forgot to import it above.
import { Rocket } from "lucide-react";
