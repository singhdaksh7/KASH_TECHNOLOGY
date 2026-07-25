import { EXORA_USER, EXORA_ASSETS, EXORA_TRANSACTIONS, formatCurrency, formatPercent } from "./exora-data";
import { ArrowDown, ArrowUp, Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExoraScreen } from "./types";

interface Props {
  onNavigate: (screen: ExoraScreen) => void;
}

export function HomeScreen({ onNavigate }: Props) {
  const trendingAssets = EXORA_ASSETS.slice(0, 3);
  const recentTransactions = EXORA_TRANSACTIONS.slice(0, 2);

  return (
    <div className="flex-1 overflow-y-auto pb-20 pt-8 px-4 scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-muted">Good morning,</p>
          <p className="font-bold">{EXORA_USER.name}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold" onClick={() => onNavigate("profile")} role="button" tabIndex={0}>
          {EXORA_USER.avatar}
        </div>
      </div>

      {/* Portfolio Balance */}
      <div className="mb-6">
        <p className="text-xs text-muted mb-1">Total Balance</p>
        <h1 className="text-3xl font-black">{formatCurrency(EXORA_USER.portfolioBalance)}</h1>
        <p className="text-xs mt-1 text-tertiary">
          {formatPercent(EXORA_USER.dailyProfitLossPct)} Today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { label: "Deposit", icon: Plus, action: () => onNavigate("wallet") },
          { label: "Withdraw", icon: Send, action: () => onNavigate("wallet") },
          { label: "Buy", icon: ArrowDown, action: () => onNavigate("trade") },
          { label: "Sell", icon: ArrowUp, action: () => onNavigate("trade") }
        ].map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-2 group" onClick={action.action}>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:text-primary transition-all">
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-muted">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Trending Assets */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-bold text-sm">Trending</h3>
          <button className="text-[10px] text-primary font-bold uppercase" onClick={() => onNavigate("markets")}>See All</button>
        </div>
        <div className="space-y-2">
          {trendingAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors" role="button" onClick={() => onNavigate("trade")} tabIndex={0}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                  {asset.symbol.substring(0,1)}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{asset.symbol}</p>
                  <p className="text-[10px] text-muted">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm leading-tight">{formatCurrency(asset.price)}</p>
                <p className={cn("text-[10px]", asset.change24h >= 0 ? "text-tertiary" : "text-error")}>
                  {formatPercent(asset.change24h)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="font-bold text-sm mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted">
                  {tx.type === "deposit" || tx.type === "buy" ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-bold text-sm capitalize leading-tight">{tx.type} {tx.asset}</p>
                  <p className="text-[10px] text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-sm">{tx.amount} {tx.asset}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
