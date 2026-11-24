"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastPayload {
  title?: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  addToast: (payload: ToastPayload | string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  addToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const addToast = useCallback((payload: ToastPayload | string) => {
    if (typeof payload === "string") {
      toast(payload, "success");
    } else {
      const msg = payload.title ? `${payload.title}: ${payload.message}` : payload.message;
      toast(msg, payload.type || "success");
    }
  }, [toast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl text-xs font-semibold backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-emerald-950/95 border-emerald-800 text-emerald-100"
                : t.type === "error"
                ? "bg-red-950/95 border-red-800 text-red-100"
                : "bg-[#0B0B0F]/95 border-white/20 text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {t.type === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {t.type === "info" && <Info className="w-4 h-4 text-[#FF5A00] shrink-0" />}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:opacity-70 transition-opacity ml-2 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
