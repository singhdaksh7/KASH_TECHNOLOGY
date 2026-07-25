import { ReactNode } from "react";

interface Props {
  headers: ReactNode[];
  children: ReactNode;
}

export function DemoTable({ headers, children }: Props) {
  return (
    <div className="w-full overflow-x-auto bg-white/5 border border-white/5 rounded-2xl scrollbar-hide">
      <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
        <thead className="bg-black/40 border-b border-white/5 uppercase text-[10px] font-bold text-muted tracking-wider">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {children}
        </tbody>
      </table>
    </div>
  );
}
