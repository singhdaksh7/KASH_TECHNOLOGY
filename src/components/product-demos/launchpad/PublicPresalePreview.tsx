import { LaunchpadFormState } from "./types";
import { formatNumber } from "./launchpad-data";
import { ArrowLeft, Clock, ShieldAlert, Coins } from "lucide-react";
import { useState } from "react";

interface Props {
  state: LaunchpadFormState;
  onBack: () => void;
}

export function PublicPresalePreview({ state, onBack }: Props) {
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const [demoAmount, setDemoAmount] = useState("");

  const handleParticipate = () => {
    setShowDemoNotice(true);
    setTimeout(() => setShowDemoNotice(false), 3000);
  };

  // Mock progress
  const mockRaised = parseFloat(state.softCap) * 0.4;
  const progressPct = Math.min((mockRaised / parseFloat(state.hardCap)) * 100, 100);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#050505] overflow-y-auto scrollbar-hide text-white relative">
      {/* Cover Header */}
      <div className="h-40 bg-gradient-to-r from-primary/30 to-tertiary/30 relative">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="px-8 pb-8 max-w-4xl mx-auto w-full -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Main Info */}
          <div className="flex-1 w-full">
            <div className="w-24 h-24 bg-black border-4 border-[#050505] rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <span className="text-3xl font-black text-primary">{state.tokenSymbol.substring(0, 2)}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">{state.tokenName}</h1>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">LIVE</span>
            </div>
            <p className="text-muted mb-8 max-w-md">Participate in the public presale for {state.tokenSymbol}. All funds are locked securely in the launchpad smart contract.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-muted mb-1">Token Price</p>
                <p className="font-bold">{state.tokenPrice} USDT</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-muted mb-1">Total Supply</p>
                <p className="font-bold">{formatNumber(state.totalSupply)}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-muted mb-1">Soft Cap</p>
                <p className="font-bold">{formatNumber(state.softCap)} USDT</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-muted mb-1">Hard Cap</p>
                <p className="font-bold">{formatNumber(state.hardCap)} USDT</p>
              </div>
            </div>
          </div>

          {/* Participate Panel */}
          <div className="w-full md:w-80 bg-white/5 border border-white/10 rounded-3xl p-6 shrink-0 mt-8 md:mt-0">
            <div className="flex items-center gap-2 text-tertiary mb-4 bg-tertiary/10 px-3 py-1.5 rounded-lg w-fit border border-tertiary/20">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold">Ends in 2 days</span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-primary">{formatNumber(mockRaised.toString())} USDT</span>
                <span className="text-muted">{formatNumber(state.hardCap)} USDT</span>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Amount (USDT)</span>
                  <span>Min: {state.minimumContribution}</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={demoAmount}
                    onChange={(e) => setDemoAmount(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold bg-white/10 px-2 py-1 rounded">
                    MAX
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleParticipate}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Coins className="w-5 h-5" /> Participate
            </button>

            {/* Demo Notice Toast */}
            <div className={`mt-4 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-500 text-xs flex gap-2 transition-opacity duration-300 ${showDemoNotice ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`}>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Demo Mode: This is a frontend simulation. No transaction was created.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
