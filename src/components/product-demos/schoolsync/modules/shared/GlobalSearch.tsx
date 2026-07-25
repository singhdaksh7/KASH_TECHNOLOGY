import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 transition-all ${isOpen ? 'w-64 ring-2 ring-primary/50' : 'w-48 cursor-text'}`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="w-4 h-4 text-muted" />
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-muted"
          onBlur={() => setIsOpen(false)}
        />
        <div className="hidden md:flex items-center gap-1 opacity-50 shrink-0">
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-sans">⌘</kbd>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-sans">K</kbd>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs text-muted px-2 py-1">Recent Searches</p>
          <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded-md transition-colors">Aisha Khan (Grade 10)</button>
          <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded-md transition-colors">Term 1 Fee Invoice</button>
          <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded-md transition-colors">Science Dept</button>
        </div>
      )}
    </div>
  );
}
