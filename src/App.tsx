import { useMemo, useState } from "react";
import { Bars } from "./components/Bars";
import { bubbleSort } from "./algorithms/bubbleSort";
import { applyStep } from "./algorithms/types";

const INPUT = [5, 3, 8, 1, 9, 2, 7];

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => bubbleSort(INPUT), []);

  const array = useMemo(
    () => steps.slice(0, stepIndex).reduce(applyStep, INPUT),
    [steps, stepIndex],
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

  return (
    <div>
      <Bars array={array} active={active} activeType={activeType} />
      <input
        type="range"
        min={0}
        max={steps.length}
        value={stepIndex}
        onChange={(e) => setStepIndex(Number(e.target.value))}
      />
      <p>
        Step {stepIndex} / {steps.length}
      </p>
    </div>
  );
}
