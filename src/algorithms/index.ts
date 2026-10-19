import type { Step } from "./types";
import { bubbleSort } from "./sorting/bubbleSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";

export type AlgorithmInfo = {
  id: string;
  name: string;
  run: (input: number[]) => Step[];
  time: { best: string; average: string; worst: string };
  space: string;
  description: string;
  pseudocode: string[];
};

export const algorithms: AlgorithmInfo[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    run: bubbleSort,
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    description:
      "Bubble Sort repeatedly steps through the array, comparing neighbouring pairs and swapping them if they're out of order. Each pass carries the largest remaining value to the end, and the algorithm stops early if a full pass makes no swaps.",
    pseudocode: [
      "repeat until no swaps:",
      "  for each adjacent pair:",
      "    compare the pair",
      "    if left > right: swap them",
    ],
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    run: insertionSort,
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    description:
      "Insertion Sort builds a sorted section from the left, taking each new element and sliding it left until it sits in the right place. It's fast on nearly sorted data, but slow on large, shuffled arrays.",
    pseudocode: [
      "for each item from the second onward:",
      "  compare it with the item on its left",
      "  if the left one is bigger: swap them, repeat",
      "  otherwise: it is in place, stop",
    ],
  },
  {
    id: "merge",
    name: "Merge Sort",
    run: mergeSort,
    time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    space: "O(n)",
    description:
      "Merge Sort splits the array in half, sorts each half recursively, then merges the two sorted halves by repeatedly picking the smaller front element. It always takes O(n log n) time, at the cost of extra memory for the temporary copies.",
    pseudocode: [
      "mergeSort(range):",
      "  if range has fewer than 2 items: return",
      "  mergeSort(left half)",
      "  mergeSort(right half)",
      "  compare front items of both halves, take the smaller",
      "  write the merged items back into the range",
    ],
  },
  {
    id: "quick",
    name: "Quick Sort",
    run: quickSort,
    time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    space: "O(log n)",
    description:
      "Quick Sort picks a pivot (here, the last element) and partitions the range so smaller values sit to its left and larger ones to its right. It then recursively sorts each side, which is fast on average but degrades to O(n²) when the pivot is consistently the smallest or largest value, such as on already sorted input.",
    pseudocode: [
      "quickSort(range):",
      "  pick the last item as the pivot",
      "  compare each item with the pivot",
      "    if smaller: swap it into the 'smaller' section",
      "  swap the pivot into its final position",
      "  quickSort(left of pivot), quickSort(right of pivot)",
    ],
  },
];
