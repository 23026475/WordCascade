import React from "react";
import Board from "./components/Board";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">WordCascade</h1>
      <Board />
    </div>
  );
}

export default App;
