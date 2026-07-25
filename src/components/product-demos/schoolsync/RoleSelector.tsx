import { SchoolSyncRole } from "./types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  currentRole: SchoolSyncRole;
  onChange: (role: SchoolSyncRole) => void;
}

export function RoleSelector({ currentRole, onChange }: Props) {
  const roles: { id: SchoolSyncRole; label: string }[] = [
    { id: "founder", label: "Founder" },
    { id: "admin", label: "Administrator" },
    { id: "teacher", label: "Teacher" },
    { id: "parent", label: "Parent" },
  ];

  return (
    <div className="flex justify-center mb-8 relative z-10">
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 relative" role="tablist">
        {roles.map((role) => {
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(role.id)}
              className={cn(
                "px-8 py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive ? "text-primary-foreground" : "text-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-role-bg"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
