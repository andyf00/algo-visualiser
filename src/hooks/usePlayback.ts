import { useEffect, useState } from "react";

export function usePlayback(totalSteps: number, delayMs: number) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, totalSteps));
    }, delayMs);

    return () => clearInterval(id);
  }, [isPlaying, delayMs, totalSteps]);

  // Auto-pause at the end
  useEffect(() => {
    if (stepIndex >= totalSteps) setIsPlaying(false);
  }, [stepIndex, totalSteps]);

  function play() {
    if (isPlaying) return;
    if (stepIndex > totalSteps) setStepIndex(0);
    setIsPlaying(true);
  }
  function pause() {
    if (!isPlaying) return;
    setIsPlaying(false);
  }
  function reset() {
    setIsPlaying(false);
    setStepIndex(0);
  }
  function stepForward() {
    setIsPlaying(false);
    if (stepIndex < totalSteps) setStepIndex(stepIndex + 1);
  }

  return { stepIndex, isPlaying, play, pause, reset, stepForward };
}
