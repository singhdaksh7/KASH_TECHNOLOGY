import { useState } from "react";
import { EXORA_USER, formatCurrency, EXORA_TRANSACTIONS } from "./exora-data";
import { ArrowDown, ArrowUp, Send, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function WalletScreen() {
  const [showNotice, setShowNotice] = useState(false);

  const handleDemoAction = () => {
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 pt-8 px-4 scrollbar-hide relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Wallet</h2>
        <button className="text-muted hover:text-foreground transition-colors" onClick={handleDemoAction}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Balances */}
      <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Total Equity</p>
        <h1 className="text-3xl font-black mb-1 text-white">{formatCurrency(EXORA_USER.portfolioBalance)}</h1>
        <p className="text-sm text-primary/80">≈ {formatCurrency(EXORA_USER.inrBalance, "INR")}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors group" onClick={handleDemoAction}>
          <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold">Deposit</span>
        </button>
        <button className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors group" onClick={handleDemoAction}>
          <Send className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold">Withdraw</span>
        </button>
      </div>

      {/* Allocations Mock */}
      <div className="mb-8">
        <h3 className="font-bold text-sm mb-4">Allocation</h3>
        <div className="flex h-3 rounded-full overflow-hidden bg-white/5 mb-4">
          <div className="bg-primary w-[45%] h-full"></div>
          <div className="bg-tertiary w-[30%] h-full"></div>
          <div className="bg-error w-[15%] h-full"></div>
          <div className="bg-purple-500 w-[10%] h-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div><span>BTC 45%</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-tertiary"></div><span>ETH 30%</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-error"></div><span>SOL 15%</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span>Other 10%</span></div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-bold text-sm">History</h3>
          <button className="text-[10px] text-primary font-bold uppercase" onClick={handleDemoAction}>View All</button>
        </div>
        <div className="space-y-2">
          {EXORA_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-muted">
                  {tx.type === "deposit" ? <ArrowDown className="w-4 h-4 text-tertiary" /> : 
                   tx.type === "withdraw" ? <ArrowUp className="w-4 h-4 text-error" /> : 
                   tx.type === "buy" ? <ArrowDown className="w-4 h-4 text-primary" /> : <ArrowUp className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <p className="font-bold text-sm capitalize leading-tight">{tx.type}</p>
                  <p className="text-[10px] text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{tx.amount} {tx.asset}</p>
                <p className="text-[10px] text-tertiary capitalize">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Toast */}
      <div className={cn(
        "absolute top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-2xl transition-all duration-300 w-max",
        showNotice ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
      )}>
        Demo Action Only
      </div>
    </div>
  );
}
