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
        

      </header>

      {mode === "sorting" ? <SortingView /> : <PathfindingView />}
    </div>
  );
}
