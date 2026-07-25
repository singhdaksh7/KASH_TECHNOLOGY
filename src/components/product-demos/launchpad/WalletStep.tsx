import { useState } from "react";
import { Wallet, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Props {
  isConnected: boolean;
  onConnect: () => void;
  onNext: () => void;
}

export function WalletStep({ isConnected, onConnect, onNext }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConnect();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
        <Wallet className="w-10 h-10 text-primary" />
        {isConnected && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0a0a0a] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-tertiary" />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-black mb-2">Connect Your Wallet</h2>
      <p className="text-muted text-sm mb-8">
        Connect a web3 wallet to deploy your token and configure your presale on the Binance Smart Chain.
      </p>

      {!isConnected ? (
        <button 
          onClick={handleConnect}
          disabled={loading}
          className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl w-full max-w-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Simulate Connection"
          )}
        </button>
      ) : (
        <button 
          onClick={onNext}
          className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl w-full max-w-xs hover:opacity-90 transition-all"
        >
          Continue
        </button>
      )}

      <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 text-left w-full">
        <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0" />
        <p className="text-xs text-muted">
          <strong className="text-foreground">Safe Simulation Mode:</strong> No real wallet connection or blockchain interaction occurs. This is a frontend demo using dummy data.
        </p>
      </div>
    </div>
  );
}
