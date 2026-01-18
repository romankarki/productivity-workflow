"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StopwatchDisplay } from "./stopwatch-display";
import { LapList } from "./lap-list";
import { LapDialog } from "./lap-dialog";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";
import { Timer } from "lucide-react";

interface StopwatchPanelProps {
  taskId: string;
  taskTitle: string;
}

export function StopwatchPanel({ taskId, taskTitle }: StopwatchPanelProps) {
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

  const handleLap = () => {
    // Calculate current lap duration
    if (laps.length > 0) {
      const lastLapEnd = new Date(laps[0].endTime).getTime();
      setCurrentLapDuration(Date.now() - lastLapEnd);
    } else {
      setCurrentLapDuration(elapsedTime);
    }
    setLapDialogOpen(true);
  };

  const handleSaveLap = async (labelId?: string) => {
    await addLap(labelId);
  };

  return (
    <>
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="h-4 w-4 text-primary" />
            <span className="truncate">{taskTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            size="default"
          />

          {laps.length > 0 && <LapList laps={laps} maxHeight="200px" />}
        </CardContent>
      </Card>

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
