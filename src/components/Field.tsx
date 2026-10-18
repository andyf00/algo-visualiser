import type { ReactNode } from "react";

type Props = {
  label: string;
  value?: ReactNode;
  children: ReactNode
};

export function Field({ label, value, children }: Props) {
  return (
    <div className="field">
      <div className="field-head">
        <span className="field-label">{label}</span>
          {value !== undefined && <span className="field-value">{value}</span>}
      </div>
      {children}
    </div>
  );
}