import { useState } from "react";
import PathfindingView from "./views/PathfindingView";
import SortingView from "./views/SortingView";
import { Segmented, type Option } from "./components/Segmented";

type Mode = "sorting" | "pathfinding";

const MODES: Option<Mode>[] = [
  { id: "sorting", label: "Sorting" },
  { id: "pathfinding", label: "Pathfinding" },
]

export default function App() {
  const [mode, setMode] = useState<Mode>("sorting");

  return (
    <div className="app">
      <header>
        <h1>Algorithm Visualiser</h1>

        <Segmented label="Mode" value={mode} options={MODES} onChange={setMode}></Segmented>
      </header>

      {mode === "sorting" ? <SortingView /> : <PathfindingView />}
    </div>
  );
}
