import { Search, ChevronDown } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filters?: {
    value: string;
    options: FilterOption[];
    onChange: (val: string) => void;
    placeholder?: string;
  }[];
}

export function DemoFilter({ searchPlaceholder, searchValue, onSearchChange, filters }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {onSearchChange && (
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={searchPlaceholder || "Search..."}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}
      
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter, idx) => (
            <div key={idx} className="relative">
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {filter.placeholder && <option value="" disabled>{filter.placeholder}</option>}
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
