import { useMemo, useState } from "react";
import { Bars } from "./components/Bars";
import { applyStep } from "./algorithms/types";
import { usePlayback } from "./hooks/usePlayback";
import { algorithms } from "./algorithms";
import { randomArray } from "./algorithms/randomArray";

export default function App() {
  const [algorithmId, setAlgorithmId] = useState("bubble");
  const [input, setInput] = useState<number[]>(() => randomArray(20));
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(5);

  const algorithm = algorithms.find((a) => a.id === algorithmId)!;
  const steps = useMemo(() => algorithm.run(input), [algorithm, input]);
  const delayMs = 1000 / speed ** 2;

  const { stepIndex, isPlaying, play, pause, reset, stepForward, seek } =
    usePlayback(steps.length, delayMs);

  const array = useMemo(
    () => steps.slice(0, stepIndex).reduce(applyStep, input),
    [steps, stepIndex, input],
  );
  const lastStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
  let active: number[] = [];
  let activeType: "compare" | "swap" | "overwrite" | null = null;

  if (lastStep !== null) {
    activeType = lastStep.type;
    if (lastStep.type === "overwrite") {
      active = [lastStep.index];
    } else {
      active = lastStep.indices;
    }
  }

  function changeAlgorithm(id: string) {
    setAlgorithmId(id);
    reset();
  }

  function newRandomArray(newSize: number) {
    setInput(randomArray(newSize));
    reset();
  }

  return (
    <div>
      <Bars array={array} active={active} activeType={activeType} />
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button onClick={stepForward}>Step</button>
      <button onClick={reset}>Reset</button>
      <input
        type="range"
        min={1}
        max={10}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      <input
        type="range"
        min={0}
        max={steps.length}
        value={stepIndex}
        onChange={(e) => seek(Number(e.target.value))}
      />
      <p>
        Step {stepIndex} / {steps.length}
      </p>
      <select
        value={algorithmId}
        onChange={(e) => changeAlgorithm(e.target.value)}
      >
        {algorithms.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <button onClick={() => newRandomArray(size)}>Randomise</button>
      <input
        type="range"
        min={5}
        max={100}
        value={size}
        onChange={(e) => {
          const n = Number(e.target.value);
          setSize(n);
          newRandomArray(n);
        }}
      />
      <span>{size}</span>
    </div>
  );
}
