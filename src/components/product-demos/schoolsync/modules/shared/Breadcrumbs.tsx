import { ChevronRight, Home } from "lucide-react";

interface Props {
  module: string;
}

export function Breadcrumbs({ module }: Props) {
  const formattedModule = module.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex items-center gap-2 text-sm text-muted mb-4 hidden md:flex">
      <Home className="w-4 h-4" />
      <ChevronRight className="w-4 h-4 opacity-50" />
      <span className="font-medium text-foreground">{formattedModule}</span>
    </div>
  );
}
