type Props = {
  array: number[];
  active: number[];
  activeType: "compare" | "swap" | "overwrite" | null;
  isDone: boolean;
};

export function Bars({ array, active, activeType, isDone }: Props) {
  const max = Math.max(1, ...array); // the 1 guards against an empty array

  return (
    <div className="bars">
      {array.map((value, i) => {
        const isActive = activeType !== null && active.includes(i);
        return (
          <div
            key={i}
            className={
              isDone ? "bar done" : isActive ? `bar ${activeType}` : "bar"
            }
            style={{ height: `${(value / max) * 100}%` }}
          />
        );
      })}
    </div>
  );
}
