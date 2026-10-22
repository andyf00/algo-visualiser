import { describe, it, expect } from "vitest";
import { describeStep } from "./describeStep";

describe("describeStep", () => {
  it("handles no step", () => {
    expect(describeStep(null, [1, 2])).toMatch(/begin/i);
  });

  it("describes a compare using the displayed values", () => {
    const text = describeStep({ type: "compare", indices: [0, 1] }, [5, 3]);
    expect(text).toContain("5");
    expect(text).toContain("3");
  });

  it("describes a swap with the original left value first", () => {
    // displayed array is AFTER the swap: [3, 5] came from [5, 3]
    expect(describeStep({ type: "swap", indices: [0, 1] }, [3, 5])).toBe(
      "Swapped 5 and 3",
    );
  });

  it("describes an overwrite", () => {
    expect(
      describeStep({ type: "overwrite", index: 2, value: 9 }, [1, 2, 9]),
    ).toContain("9");
  });

  it("prefers the step's own note", () => {
    expect(
      describeStep({ type: "swap", indices: [0, 1], note: "hi" }, [1, 2]),
    ).toBe("hi");
  });
});
