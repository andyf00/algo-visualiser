import { useEffect, useState } from "react";

export function usePlayback(totalSteps: number, delayMs: number) {
  const [stepIndex, setStepIndex] = useState(0);
  const [wantsToPlay, setWantsToPlay] = useState(false);

  const isPlaying = wantsToPlay && stepIndex < totalSteps;

  // Timer
  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, totalSteps));
    }, delayMs);

    return () => clearInterval(id);
  }, [isPlaying, delayMs, totalSteps]);

  function play() {
    if (stepIndex >= totalSteps) setStepIndex(0);
    setWantsToPlay(true);
  }
  function pause() {
    setWantsToPlay(false);
  }
  function reset() {
    setWantsToPlay(false);
    setStepIndex(0);
  }
  function stepForward() {
    setWantsToPlay(false);
    setStepIndex((i) => Math.min(i + 1, totalSteps));
  }
  function seek(n: number) {
    setWantsToPlay(false);
    setStepIndex(Math.max(0, Math.min(n, totalSteps)));
  }

  return { stepIndex, isPlaying, play, pause, reset, stepForward, seek };
}
