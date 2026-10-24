import type { Grid, PathStep } from "./types";
import { bfs } from "./bfs";
import { dijkstra } from "./dijkstra";
import { astar } from "./astar";

export type PathAlgorithmInfo = {
  id: string;
  name: string;
  run: (grid: Grid) => PathStep[];
  time: string;
  space: string;
  usesWeights: boolean;
  guaranteesShortest: boolean;
  description: string;
  pseudocode: string[];
};

export const pathAlgorithms: PathAlgorithmInfo[] = [
  {
    id: "bfs",
    name: "BFS",
    run: bfs,
    time: "O(V + E)",
    space: "O(V)",
    usesWeights: false,
    guaranteesShortest: true,
    description:
      "Breadth-first search explores outward from the start in rings, " +
      "one step at a time, so the first time it reaches the end it has used the fewest steps possible. " +
      "It ignores cell weights, so the route with the fewest steps may not be the cheapest.",
    pseudocode: [
      "queue = [start], mark start as seen",
      "while the queue is not empty:",
      "  take the next cell and visit it",
      "  if it is the end: stop",
      "  add unseen neighbours to the queue",
      "walk back to draw the path",
    ],
  },
  {
    id: "dijkstra",
    name: "Dijkstra",
    run: dijkstra,
    time: "O((V + E) log V)",
    space: "O(V)",
    usesWeights: true,
    guaranteesShortest: true,
    description:
      "Dijkstra's algorithm always explores the cheapest known cell next, " +
      "and updates a neighbour whenever it finds a cheaper way there. " +
      "It handles weighted cells and always finds the lowest-cost path. " +
      "It explores in every direction, so it can visit a lot of cells. " +
      "This version scans for the cheapest cell instead of using a heap, which is simpler but slower on big grids.",
    pseudocode: [
      "cost[start] = 0, every other cell = infinity",
      "while there are discovered cells:",
      "  visit discovered cell with lowest cost",
      "  if it is the end: stop",
      "  for each neighbour: cost = my cost + its weight",
      "    if cheaper than its best so far: update it",
      "walk back to draw the path",
    ],
  },
  {
    id: "astar",
    name: "A*",
    run: astar,
    time: "O((V + E) log V)",
    space: "O(V)",
    usesWeights: true,
    guaranteesShortest: true,
    description:
      "A* works like Dijkstra, but ranks each cell by its cost so far plus " +
      "a guess of the distance still to go (Manhattan distance here). " +
      "That guess pulls the search toward the end, so it usually visits far fewer cells. " +
      "It still finds the cheapest path, because the guess never overestimates.",
    pseudocode: [
      "cost[start] = 0, every other cell = infinity",
      "while there are discovered cells:",
      "  visit cell with lowest cost + estimate to end",
      "  if it is the end: stop",
      "  for each neighbour: cost = my cost + its weight",
      "    if cheaper than its best so far: update it",
      "walk back to draw the path",
    ],
  },
];
