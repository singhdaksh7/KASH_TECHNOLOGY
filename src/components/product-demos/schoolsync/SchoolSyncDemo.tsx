"use client";

import { useState } from "react";
import { SchoolSyncRole } from "./types";
import { LaptopFrame } from "../shared/LaptopFrame";
import { RoleSelector } from "./RoleSelector";
import { AdminDashboard } from "./AdminDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { ParentDashboard } from "./ParentDashboard";
import { FounderDashboard } from "./FounderDashboard";
import { AnimatePresence, motion } from "framer-motion";

export function SchoolSyncDemo() {
  const [role, setRole] = useState<SchoolSyncRole>("admin");

  const renderDashboard = () => {
    switch (role) {
      case "founder":
        return <FounderDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "parent":
        return <ParentDashboard />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <RoleSelector currentRole={role} onChange={setRole} />
      
      <LaptopFrame>
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </LaptopFrame>
    </div>
  );
}
