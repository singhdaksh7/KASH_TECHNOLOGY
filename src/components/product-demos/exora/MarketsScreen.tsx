import { useState } from "react";
import { EXORA_ASSETS, formatCurrency, formatPercent } from "./exora-data";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExoraScreen } from "./types";

interface Props {
  onNavigate: (screen: ExoraScreen) => void;
}

export function MarketsScreen({ onNavigate }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "crypto" | "forex">("all");

  const filteredAssets = EXORA_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(search.toLowerCase()) || 
    asset.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto pb-20 pt-8 px-4 scrollbar-hide">
      <h2 className="text-xl font-bold mb-4">Markets</h2>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input 
          type="text" 
          placeholder="Search assets..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "crypto", "forex"] as const).map((f) => (
          <button 
            key={f}
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all",
              filter === f ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted hover:bg-white/10"
            )}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => onNavigate("trade")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                {asset.symbol.substring(0,1)}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{asset.symbol}</p>
                <p className="text-[10px] text-muted">{asset.name}</p>
              </div>
            </div>
            
            {/* Mini Chart Mock */}
            <div className="w-16 h-8 flex items-end justify-between gap-[2px]">
              {asset.chartData.map((val, i) => (
                <div 
                  key={i} 
                  className={cn("w-full rounded-sm", asset.change24h >= 0 ? "bg-tertiary/50" : "bg-error/50")} 
                  style={{ height: `${(val / 60) * 100}%` }}
                ></div>
              ))}
            </div>

            <div className="text-right">
              <p className="font-bold text-sm leading-tight">{formatCurrency(asset.price)}</p>
              <p className={cn("text-[10px]", asset.change24h >= 0 ? "text-tertiary" : "text-error")}>
                {formatPercent(asset.change24h)}
              </p>
            </div>
          </div>
        ))}
        {filteredAssets.length === 0 && (
          <p className="text-center text-sm text-muted py-8">No assets found.</p>
        )}
      </div>
    </div>
  );
}
