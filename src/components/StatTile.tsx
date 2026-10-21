type Props = {
  label: string;
  value: number | string;
};

export function StatTile({ label, value }: Props) {
  return (
    <div className="stat-tile">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
