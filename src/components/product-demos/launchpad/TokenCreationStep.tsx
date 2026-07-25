import { LaunchpadFormState } from "./types";
import { formatNumber } from "./launchpad-data";
import { Coins, AlertCircle } from "lucide-react";

interface Props {
  state: LaunchpadFormState;
  errors: Record<string, string>;
  onChange: (field: keyof LaunchpadFormState, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TokenCreationStep({ state, errors, onChange, onNext, onBack }: Props) {
  const isValid = Object.keys(errors).length === 0 && state.tokenName && state.tokenSymbol && state.totalSupply;

  return (
    <div className="flex-1 flex flex-col p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
          <Coins className="text-primary w-6 h-6" />
          Token Details
        </h2>
        <p className="text-muted text-sm">Define the core parameters of your BEP-20 token.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">Token Name</label>
            <input 
              type="text" 
              placeholder="e.g. Bitcoin" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              value={state.tokenName}
              onChange={(e) => onChange("tokenName", e.target.value)}
            />
            {errors.tokenName && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.tokenName}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">Token Symbol</label>
            <input 
              type="text" 
              placeholder="e.g. BTC" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors uppercase"
              value={state.tokenSymbol}
              onChange={(e) => onChange("tokenSymbol", e.target.value.toUpperCase())}
            />
            {errors.tokenSymbol && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.tokenSymbol}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">Total Supply</label>
            <input 
              type="number" 
              placeholder="10000000" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              value={state.totalSupply}
              onChange={(e) => onChange("totalSupply", e.target.value)}
            />
            {errors.totalSupply && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.totalSupply}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">Decimals</label>
            <input 
              type="number" 
              min="0" max="18"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              value={state.decimals}
              onChange={(e) => onChange("decimals", e.target.value)}
            />
            {errors.decimals && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.decimals}</p>}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
          <h3 className="font-bold text-sm mb-4 text-muted uppercase tracking-wider">Live Preview</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary font-black text-xl flex items-center justify-center">
              {state.tokenSymbol.substring(0, 2) || "?"}
            </div>
            <div>
              <p className="font-black text-xl">{state.tokenName || "Unknown Token"}</p>
              <p className="text-muted">{state.tokenSymbol || "TKN"}</p>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Total Supply</span>
              <span className="font-bold">{state.totalSupply ? formatNumber(state.totalSupply) : "0"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Decimals</span>
              <span className="font-bold">{state.decimals || "18"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Network</span>
              <span className="font-bold text-yellow-500">BSC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors">
          Back
        </button>
        <button 
          onClick={onNext} 
          disabled={!isValid}
          className="px-8 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Continue to Presale
        </button>
      </div>
    </div>
  );
}
