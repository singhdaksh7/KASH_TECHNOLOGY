import { cn } from "@/lib/utils";

interface Props {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function DetailTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex gap-6 border-b border-white/10 mb-6">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "pb-3 text-sm font-bold relative transition-colors",
            activeTab === tab ? "text-primary" : "text-muted hover:text-foreground"
          )}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}
