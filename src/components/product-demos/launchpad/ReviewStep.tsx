import { LaunchpadFormState } from "./types";
import { formatNumber, DUMMY_WALLET_ADDRESS, NETWORK_NAME } from "./launchpad-data";
import { FileCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const DetailRow = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
    <span className="text-muted text-sm">{label}</span>
    <span className={`font-bold text-sm ${highlight ? 'text-primary' : ''}`}>{value}</span>
  </div>
);

interface Props {
  state: LaunchpadFormState;
  onNext: () => void;
  onBack: () => void;
}

export function ReviewStep({ state, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePublish = () => {
    setLoading(true);
    // Simulate transaction delay
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-4xl mx-auto w-full overflow-y-auto scrollbar-hide">
      <div className="mb-6 shrink-0 text-center">
        <h2 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
          <FileCheck className="text-primary w-6 h-6" />
          Review Deployment
        </h2>
        <p className="text-muted text-sm">Please review your token and presale configuration carefully.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
          <h3 className="font-bold text-sm mb-4 text-muted uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-tertiary" />
            Token Details
          </h3>
          <div className="space-y-1">
            <DetailRow label="Name" value={state.tokenName} />
            <DetailRow label="Symbol" value={state.tokenSymbol} />
            <DetailRow label="Total Supply" value={formatNumber(state.totalSupply)} />
            <DetailRow label="Decimals" value={state.decimals} />
            <DetailRow label="Network" value={NETWORK_NAME} highlight />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
          <h3 className="font-bold text-sm mb-4 text-muted uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-tertiary" />
            Presale Configuration
          </h3>
          <div className="space-y-1">
            <DetailRow label="Allocation" value={`${formatNumber(state.presaleAllocation)} ${state.tokenSymbol}`} />
            <DetailRow label="Token Price" value={`${state.tokenPrice} USDT`} />
            <DetailRow label="Soft Cap" value={`${formatNumber(state.softCap)} USDT`} />
            <DetailRow label="Hard Cap" value={`${formatNumber(state.hardCap)} USDT`} highlight />
            <DetailRow label="Min/Max Buy" value={`${state.minimumContribution} - ${state.maximumContribution} USDT`} />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3 text-left w-full mb-8 shrink-0">
        <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-primary mb-1">Demo Deployment Simulation</p>
          <p className="text-primary/80">
            Clicking publish will simulate the deployment process. No transaction will be sent from {DUMMY_WALLET_ADDRESS}, and no real fees will be charged.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-auto pt-4 border-t border-white/5 shrink-0">
        <button onClick={onBack} disabled={loading} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
          Back to Edit
        </button>
        <button 
          onClick={handlePublish} 
          disabled={loading}
          className="px-8 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px]"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Deploying...
            </>
          ) : (
            "Publish to Testnet"
          )}
        </button>
      </div>
    </div>
  );
}
