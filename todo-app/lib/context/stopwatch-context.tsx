"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useActiveStopwatch } from "@/lib/hooks/use-active-stopwatch";
import { StopwatchWithTask } from "@/lib/types/stopwatch";

interface StopwatchContextValue {
  activeStopwatch: StopwatchWithTask | null;
  elapsedTime: number;
  isLoading: boolean;
  openModal: (taskId: string, taskTitle: string) => void;
  closeModal: () => void;
  modalState: {
    open: boolean;
    taskId: string;
    taskTitle: string;
  };
}

const StopwatchContext = createContext<StopwatchContextValue | null>(null);

export function StopwatchProvider({ children }: { children: ReactNode }) {
  const { data: activeStopwatch, isLoading } = useActiveStopwatch();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [modalState, setModalState] = useState({
    open: false,
    taskId: "",
    taskTitle: "",
  });

  // Calculate elapsed time
  const calculateElapsedTime = useCallback((sw: StopwatchWithTask | null) => {
    if (!sw) return 0;

    let elapsed = sw.totalDuration;
    if (sw.isActive) {
      const startTime = new Date(sw.startTime).getTime();
      elapsed += Date.now() - startTime;
    }
    return elapsed;
  }, []);

  // Update elapsed time for active stopwatch
  useEffect(() => {
    if (activeStopwatch?.isActive) {
      setElapsedTime(calculateElapsedTime(activeStopwatch));

      const interval = setInterval(() => {
        setElapsedTime(calculateElapsedTime(activeStopwatch));
      }, 1000); // Update every second for floating indicator

      return () => clearInterval(interval);
    } else {
      setElapsedTime(calculateElapsedTime(activeStopwatch));
    }
  }, [activeStopwatch, calculateElapsedTime]);

  const openModal = useCallback((taskId: string, taskTitle: string) => {
    setModalState({ open: true, taskId, taskTitle });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <StopwatchContext.Provider
      value={{
        activeStopwatch,
        elapsedTime,
        isLoading,
        openModal,
        closeModal,
        modalState,
      }}
    >
      {children}
    </StopwatchContext.Provider>
  );
}

export function useStopwatchContext() {
  const context = useContext(StopwatchContext);
  if (!context) {
    throw new Error(
      "useStopwatchContext must be used within a StopwatchProvider"
    );
  }
  return context;
}
