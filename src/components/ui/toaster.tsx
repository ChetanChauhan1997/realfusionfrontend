"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { cn } from "@/lib/utils"; // optional helper for classNames

export function Toaster() {
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState<{
    type: "success" | "error" | "warning" | "danger";
    message: string;
  }>({
    type: "success",
    message: "",
  });

  // expose helper (or move to Zustand/Context for global)
  const showToast = (
    type: "success" | "error" | "warning" | "danger",
    message: string
  ) => {
    setToastData({ type, message });
    setOpen(false); // reset
    setTimeout(() => setOpen(true), 0); // re-open
  };

  // attach to window so you can call from anywhere
  if (typeof window !== "undefined") {
    (window as any).showToast = showToast;
  }

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        duration={4000} // ⏳ auto close after 4s
        className={cn(
          "fixed bottom-5 right-5 z-50 w-[280px] rounded-2xl p-4 shadow-lg text-white flex flex-col gap-2",
          toastData.type === "success" && "bg-green-600",
          toastData.type === "error" && "bg-red-600",
          toastData.type === "warning" && "bg-yellow-600",
          toastData.type === "danger" && "bg-orange-600"
        )}
      >
        <Toast.Description className="text-sm font-medium">
          {toastData.message}
        </Toast.Description>

        {/* progress bar */}
        <div className="relative h-1 w-full bg-white/30 rounded">
          <div className="absolute left-0 top-0 h-1 bg-white rounded animate-toast-progress"></div>
        </div>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-[340px] max-w-full m-0 list-none z-50 outline-none" />
    </Toast.Provider>
  );
}
