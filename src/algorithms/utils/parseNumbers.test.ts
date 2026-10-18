import { describe, it, expect } from "vitest";
import { parseNumbers } from "./parseNumbers";

describe("parseNumbers", () => {
  it.each([
    ["1, 2, 3", [1, 2, 3]],
    ["1 2 3", [1, 2, 3]],
    ["  4,5  ", [4, 5]],
    ["1,,2", [1, 2]],
    ["007", [7]],
    ["999", [999]],
  ])("accepts %j", (text, expected) => {
    expect(parseNumbers(text)).toEqual(expected);
  });

  it.each([
    [""],
    ["   "],
    [","],
    ["abc"],
    ["1, abc"],
    ["1.5"],
    ["-5"],
    ["0"],
    ["1, 0, 5"],
    ["1e3"],
    ["1000"],
  ])("rejects %j", (text) => {
    expect(parseNumbers(text)).toBeNull();
  });

  it("accepts 100 numbers but rejects 101", () => {
    expect(parseNumbers(Array(100).fill("1").join(","))).toHaveLength(100);
    expect(parseNumbers(Array(101).fill("1").join(","))).toBeNull();
  });
});
