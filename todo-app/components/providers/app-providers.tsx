"use client";

import { QueryProvider } from "@/lib/providers/query-provider";
import { StopwatchProvider } from "@/lib/context/stopwatch-context";
import { Toaster } from "@/components/ui/sonner";
import { FloatingIndicator } from "@/components/stopwatch/floating-indicator";
import { StopwatchModal } from "@/components/stopwatch/stopwatch-modal";
import { useStopwatchContext } from "@/lib/context/stopwatch-context";

function StopwatchModalWrapper() {
  const { modalState, closeModal } = useStopwatchContext();

  if (!modalState.taskId) return null;

  return (
    <StopwatchModal
      open={modalState.open}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
      taskId={modalState.taskId}
      taskTitle={modalState.taskTitle}
    />
  );
}

function StopwatchOverlays() {
  return (
    <>
      <FloatingIndicator />
      <StopwatchModalWrapper />
    </>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <StopwatchProvider>
        {children}
        <StopwatchOverlays />
        <Toaster />
      </StopwatchProvider>
    </QueryProvider>
  );
}
