import React, { useState, useEffect, useRef } from "react";
import { DICTIONARY } from "../data/dictionary";

const BOARD_SIZE = 8;
const getRandomLetter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
};

interface Tile {
  letter: string;
  selected: boolean;
  row: number;
  col: number;
}

const Board: React.FC = () => {
  const [board, setBoard] = useState<Tile[][]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [lastSelected, setLastSelected] = useState<Tile | null>(null);
  const [message, setMessage] = useState<string>("");
  const isDragging = useRef(false);

  // Initialize the board
  useEffect(() => {
    const newBoard: Tile[][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: Tile[] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push({ letter: getRandomLetter(), selected: false, row: i, col: j });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  }, []);

  // Update selectedWord when selectedTiles change
  useEffect(() => {
    const word = selectedTiles.map(t => t.letter).join("");
    setSelectedWord(word);
  }, [selectedTiles]);

  const isAdjacent = (tile1: Tile, tile2: Tile) => {
    const dx = Math.abs(tile1.row - tile2.row);
    const dy = Math.abs(tile1.col - tile2.col);
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
  };

  const selectTile = (tile: Tile) => {
    setBoard(prev => {
      const newBoard = prev.map(r => r.map(t => ({ ...t })));
      const current = newBoard[tile.row][tile.col];

      if (!current.selected && (!lastSelected || isAdjacent(current, lastSelected))) {
        current.selected = true;
        setLastSelected(current);
        setSelectedTiles(prevSelected => [...prevSelected, current]);
      }

      return newBoard;
    });
  };

  const handleStart = (tile: Tile) => {
    isDragging.current = true;
    selectTile(tile);
  };

  const handleEnter = (tile: Tile) => {
    if (isDragging.current) selectTile(tile);
  };

  const handleEnd = () => {
    isDragging.current = false;
    checkWord();
    setLastSelected(null);
  };

  const checkWord = () => {
    if (selectedTiles.length === 0) return;

    const word = selectedTiles.map(t => t.letter).join("");

    if (DICTIONARY.includes(word.toUpperCase())) {
      setMessage(`✅ "${word}" is valid!`);
    } else {
      setMessage(`❌ "${word}" is not valid`);
    }

    // Reset selection
    setBoard(prev => prev.map(row => row.map(tile => ({ ...tile, selected: false }))));
    setSelectedTiles([]);
    setSelectedWord("");
    setLastSelected(null);
  };

  return (
    <div
      className="flex flex-col items-center mt-6 select-none"
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchEnd={handleEnd}
    >
      <h2 className="text-xl font-semibold mb-2">Selected Word: {selectedWord}</h2>
      <p className="mb-4">{message}</p>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map(tile => (
            <div
              key={`${tile.row}-${tile.col}`}
              data-row={tile.row}
              data-col={tile.col}
              onMouseDown={() => handleStart(tile)}
              onMouseEnter={() => handleEnter(tile)}
              onTouchStart={() => handleStart(tile)}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.dataset.row && element.dataset.col) {
                  const rowIdx = Number(element.dataset.row);
                  const colIdx = Number(element.dataset.col);
                  handleEnter(board[rowIdx][colIdx]);
                }
              }}
              className={`w-12 h-12 m-1 flex items-center justify-center font-bold text-lg rounded-lg shadow-md cursor-pointer
                ${tile.selected ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
            >
              {tile.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
