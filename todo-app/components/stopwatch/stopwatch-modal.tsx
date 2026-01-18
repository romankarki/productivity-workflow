"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StopwatchDisplay } from "./stopwatch-display";
import { LapList } from "./lap-list";
import { LapDialog } from "./lap-dialog";
import { formatTime } from "./time-display";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";
import { Separator } from "@/components/ui/separator";
import { Clock, History } from "lucide-react";

interface StopwatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
}

export function StopwatchModal({
  open,
  onOpenChange,
  taskId,
  taskTitle,
}: StopwatchModalProps) {
  const {
    elapsedTime,
    isRunning,
    isPaused,
    isStopped,
    isLoading,
    laps,
    start,
    pause,
    resume,
    stop,
    addLap,
  } = useStopwatch(taskId);

  const [lapDialogOpen, setLapDialogOpen] = useState(false);
  const [currentLapDuration, setCurrentLapDuration] = useState(0);

  // Calculate current lap duration
  useEffect(() => {
    if (isRunning && laps.length > 0) {
      const lastLapEnd = new Date(laps[0].endTime).getTime();
      const interval = setInterval(() => {
        setCurrentLapDuration(Date.now() - lastLapEnd);
      }, 100);
      return () => clearInterval(interval);
    } else if (isRunning) {
      setCurrentLapDuration(elapsedTime);
    }
  }, [isRunning, laps, elapsedTime]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (isRunning) {
            pause();
          } else if (isPaused) {
            resume();
          } else if (!isStopped) {
            start();
          }
          break;
        case "KeyL":
          if (isRunning) {
            setLapDialogOpen(true);
          }
          break;
        case "KeyS":
          if (isRunning || isPaused) {
            stop();
          }
          break;
      }
    },
    [open, isRunning, isPaused, isStopped, start, pause, resume, stop]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleLap = () => {
    setLapDialogOpen(true);
  };

  const handleSaveLap = async (labelId?: string) => {
    await addLap(labelId);
  };

  // Calculate total time from all laps
  const totalLapTime = laps.reduce((acc, lap) => acc + lap.duration, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-medium">
              <Clock className="h-4 w-4 text-primary" />
              <span className="truncate">{taskTitle}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Main Timer Display */}
            <StopwatchDisplay
              elapsedTime={elapsedTime}
              isRunning={isRunning}
              isPaused={isPaused}
              isStopped={isStopped}
              isLoading={isLoading}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onLap={handleLap}
              size="large"
            />

            <Separator />

            {/* Laps Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Laps</h3>
              </div>
              <LapList laps={laps} maxHeight="200px" />
            </div>

            <Separator />

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Session Time</p>
                <p className="font-mono text-lg font-semibold tabular-nums">
                  {formatTime(elapsedTime)}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Lap Time</p>
                <p className="font-mono text-lg font-semibold tabular-nums">
                  {formatTime(totalLapTime)}
                </p>
              </div>
            </div>

            {/* Keyboard Hints */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">Space</kbd>{" "}
                {isRunning ? "Pause" : "Start"}
              </span>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">L</kbd> Lap
              </span>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">S</kbd> Stop
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lap Dialog */}
      <LapDialog
        open={lapDialogOpen}
        onOpenChange={setLapDialogOpen}
        onSave={handleSaveLap}
        currentDuration={currentLapDuration}
        lapNumber={laps.length + 1}
      />
    </>
  );
}
