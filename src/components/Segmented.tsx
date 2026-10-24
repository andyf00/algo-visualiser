export type Option<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (id: T) => void;
  label: string; // used for aria-label
};

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: Props<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          className={o.id === value ? "active" : ""}
          aria-pressed={o.id === value}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
