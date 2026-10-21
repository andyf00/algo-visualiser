import { useState } from "react";
import PathfindingView from "./views/PathfindingView";
import SortingView from "./views/SortingView";

type Mode = "sorting" | "pathfinding";

export default function App() {
  const [mode, setMode] = useState<Mode>("sorting");

  return (
    <div className="app">
      <header>
        <h1>Algorithm Visualiser</h1>

        <div className="segmented" role="group" aria-label="Mode">
          <button
            className={mode === "sorting" ? "active" : ""}
            aria-pressed={mode === "sorting"}
            onClick={() => setMode("sorting")}
          >
            Sorting
          </button>
          <button
            className={mode === "pathfinding" ? "active" : ""}
            aria-pressed={mode === "pathfinding"}
            onClick={() => setMode("pathfinding")}
          >
            Pathfinding
          </button>
        </div>
      </header>

      {mode === "sorting" ? <SortingView /> : <PathfindingView />}
    </div>
  );
}
