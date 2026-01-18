"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState, createContext, useContext, ReactNode } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning" | "danger";

interface ToastContextProps {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context.showToast;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("info");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (type: ToastType, message: string) => {
    setToastType(type);
    setToastMessage(message);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          className={cn(
            "shadow-md rounded-lg p-4 flex items-center gap-3 border transition-colors",
            toastType === "success" &&
              "bg-green-600 border-green-700 text-white",
            toastType === "error" && "bg-red-600 border-red-700 text-white",
            toastType === "warning" &&
              "bg-yellow-400 border-yellow-500 text-slate-900",
            toastType === "danger" &&
              "bg-orange-600 border-orange-700 text-white",
            toastType === "info" && "bg-blue-600 border-blue-700 text-white"
          )}
          open={open}
          onOpenChange={setOpen}
          duration={4000} // Auto close after 4s
        >
          {toastType === "success" && (
            <CheckCircle className="text-white w-5 h-5 shrink-0" />
          )}
          {toastType === "error" && (
            <XCircle className="text-white w-5 h-5 shrink-0" />
          )}
          {toastType === "info" && (
            <Info className="text-white w-5 h-5 shrink-0" />
          )}
          {toastType === "warning" && (
            <AlertTriangle className="text-slate-900 w-5 h-5 shrink-0" />
          )}
          {toastType === "danger" && (
            <AlertOctagon className="text-white w-5 h-5 shrink-0" />
          )}
          <span
            className={cn(
              "font-medium",
              toastType === "warning" ? "text-slate-900" : "text-white"
            )}
          >
            {toastMessage}
          </span>
        </Toast.Root>

        <Toast.Viewport className="fixed top-4 right-4 w-96 max-w-full z-[100] " />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
