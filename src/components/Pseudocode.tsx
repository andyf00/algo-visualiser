type Props = { lines: string[]; activeLine: number | null };

export function Pseudocode({ lines, activeLine }: Props) {
  return (
    <div className="pseudocode">
      {lines.map((text, i) => (
        <div key={i} className={i === activeLine ? "line active" : "line"}>
          {text}
        </div>
      ))}
    </div>
  );
}
