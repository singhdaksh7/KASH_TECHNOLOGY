import { AlertCircle, Lock } from "lucide-react";

interface Props {
  moduleName: string;
}

export function ModulePreview({ moduleName }: Props) {
  const formattedName = moduleName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
        <Lock className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{formattedName} Module</h3>
      <p className="text-muted max-w-md mb-8">
        This is a local UI preview. The full {formattedName} module connects to a secure backend database which is disabled for this public demo.
      </p>
      
      <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-primary/20">
        <AlertCircle className="w-4 h-4" />
        Interactive Demo Notice
      </div>
    </div>
  );
}
