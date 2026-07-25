import { useState } from "react";
import { EXORA_ASSETS, formatCurrency, formatPercent } from "./exora-data";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TradeScreen() {
  const asset = EXORA_ASSETS[0]; // Default to BTC
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [showNotice, setShowNotice] = useState(false);

  const handleConfirm = () => {
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 pt-8 px-4 scrollbar-hide relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center gap-2 font-bold text-lg">
          {asset.symbol}/USDT <ChevronDown className="w-4 h-4 text-muted" />
        </button>
        <div className="text-right">
          <p className="font-bold text-sm">{formatCurrency(asset.price)}</p>
          <p className={cn("text-[10px]", asset.change24h >= 0 ? "text-tertiary" : "text-error")}>
            {formatPercent(asset.change24h)}
          </p>
        </div>
      </div>

      {/* Chart Mock */}
      <div className="h-48 bg-[#0a0a0a] rounded-xl border border-white/10 p-2 flex items-end gap-1 mb-4">
        {asset.chartData.map((val, i) => (
          <div 
            key={i} 
            className="flex-grow bg-primary/80 rounded-t-sm transition-all" 
            style={{ height: `${(val / 60) * 100}%` }}
          ></div>
        ))}
      </div>

      {/* Time Controls */}
      <div className="flex justify-between mb-6 px-2">
        {["1H", "1D", "1W", "1M", "1Y"].map((t) => (
          <button key={t} className={cn("text-[10px] font-bold transition-colors", t === "1D" ? "text-primary" : "text-muted")}>
            {t}
          </button>
        ))}
      </div>

      {/* Order Controls */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
        <div className="flex bg-black/40 rounded-lg p-1 mb-4">
          <button 
            className={cn("flex-1 py-2 text-xs font-bold rounded-md transition-all", orderType === "buy" ? "bg-tertiary text-tertiary-foreground" : "text-muted hover:text-foreground")}
            onClick={() => setOrderType("buy")}
          >
            Buy
          </button>
          <button 
            className={cn("flex-1 py-2 text-xs font-bold rounded-md transition-all", orderType === "sell" ? "bg-error text-error-foreground" : "text-muted hover:text-foreground")}
            onClick={() => setOrderType("sell")}
          >
            Sell
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] text-muted mb-1">
              <span>Order Type</span>
              <span>Available: 12,450 USDT</span>
            </div>
            <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm flex justify-between items-center">
              <span>Market</span>
              <ChevronDown className="w-4 h-4 text-muted" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-muted mb-1">
              <span>Amount</span>
            </div>
            <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3 flex justify-between items-center focus-within:border-primary transition-colors">
              <input 
                type="number" 
                placeholder="0.00" 
                className="bg-transparent border-none outline-none text-sm w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="text-xs font-bold text-muted ml-2">{asset.symbol}</span>
            </div>
          </div>
          
          <button 
            className={cn(
              "w-full py-3 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95",
              orderType === "buy" ? "bg-tertiary text-tertiary-foreground shadow-tertiary/20" : "bg-error text-error-foreground shadow-error/20"
            )}
            onClick={handleConfirm}
          >
            {orderType === "buy" ? "Buy" : "Sell"} {asset.symbol}
          </button>
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
