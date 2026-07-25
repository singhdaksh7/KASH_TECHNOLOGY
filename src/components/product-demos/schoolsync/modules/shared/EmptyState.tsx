import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-muted text-sm max-w-sm">{description}</p>
    </div>
  );
}
