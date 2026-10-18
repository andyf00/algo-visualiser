import { useMemo, useState } from "react";
import { Bars } from "./components/Bars";
import { Field } from "./components/Field";
import { applyStep } from "./algorithms/types";
import { usePlayback } from "./hooks/usePlayback";
import { algorithms } from "./algorithms";
import { randomArray } from "./algorithms/utils/randomArray";
import { computeStats } from "./algorithms/stats";
import {
  parseNumbers,
  MAX_VALUE,
  MAX_LENGTH,
} from "./algorithms/utils/parseNumbers";
import { describeStep } from "./algorithms/describeStep";
import { Pseudocode } from "./components/Pseudocode";

export default function App() {
  const [algorithmId, setAlgorithmId] = useState("bubble");
  const [input, setInput] = useState<number[]>(() => randomArray(20));
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const algorithm = algorithms.find((a) => a.id === algorithmId)!;
  const steps = useMemo(() => algorithm.run(input), [algorithm, input]);
  const delayMs = 1000 / speed ** 2;

  const { stepIndex, isPlaying, play, pause, reset, stepForward, seek } =
    usePlayback(steps.length, delayMs);

  const array = useMemo(
    () => steps.slice(0, stepIndex).reduce(applyStep, input),
    [steps, stepIndex, input],
  );
  const stats = useMemo(
    () => computeStats(steps, stepIndex),
    [steps, stepIndex],
  );
  const lastStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
  let active: number[] = [];
  let activeType: "compare" | "swap" | "overwrite" | null = null;

  const isDone = steps.length > 0 && stepIndex === steps.length;
  const activeLine = isDone ? null : (lastStep?.line ?? null);
  const explanation =
    steps.length === 0
      ? "Nothing to sort."
      : isDone
        ? "Sorted!"
        : describeStep(lastStep, array);

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

  function applyCustomInput() {
    const parsed = parseNumbers(text);
    if (parsed === null) {
      setError(
        `Enter 1 to ${MAX_LENGTH} whole numbers between 1 and ${MAX_VALUE}, separated by commas or spaces.`,
      );
      return;
    }
    setError(null);
    setInput(parsed);
    setSize(parsed.length);
    reset();
  }

  return (
    <div
      className="app"
      style={
        { "--step-ms": `${Math.min(delayMs, 150)}ms` } as React.CSSProperties
      }
    >
      <header>
        <h1>Algorithm Visualiser</h1>
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
      </header>

      <main>
        <section className="visualiser">
          <Bars
            array={array}
            active={active}
            activeType={activeType}
            isDone={isDone}
          />
          <p aria-live="polite">{explanation}</p>
        </section>

        <section className="controls">
          <div className="button-row">
            <button className="primary" onClick={isPlaying ? pause : play}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={stepForward}>Step</button>
            <button onClick={reset}>Reset</button>
          </div>

          <Field label="Speed" value={`${speed}x`}>
            <input
              type="range"
              min={1}
              max={10}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </Field>

          <Field label="Progress" value={`${stepIndex} / ${steps.length}`}>
            <input
              type="range"
              min={0}
              max={steps.length}
              value={stepIndex}
              onChange={(e) => seek(Number(e.target.value))}
            />
          </Field>

          <Field label="Array size" value={size}>
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
          </Field>

          <button onClick={() => newRandomArray(size)}>Randomise</button>

          <Field label="Custom input">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="5, 3, 8, 1"
            />
            <button onClick={applyCustomInput}>Use these numbers</button>
            {error && <p role="alert">{error}</p>}
          </Field>
        </section>

        <aside className="info">
          <p>
            Comparisons: {stats.comparisons} | Swaps: {stats.swaps} | Writes:{" "}
            {stats.writes}
          </p>
          <p>
            Time: best {algorithm.time.best}, average {algorithm.time.average},
            worst {algorithm.time.worst} | Space: {algorithm.space}
          </p>
          <p>{algorithm.description}</p>
          <Pseudocode lines={algorithm.pseudocode} activeLine={activeLine} />
        </aside>
      </main>
    </div>
  );
}
