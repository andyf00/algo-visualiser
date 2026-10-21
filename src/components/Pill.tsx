export function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span className="pill">
      <span className="pill-label">{label}</span> {value}
    </span>
  );
}
