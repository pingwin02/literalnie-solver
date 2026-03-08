import { getGreenLetterHint, hasConflictInGrid } from "../utils/passwordGrid";
import "../styles/WordleGrid.css";

function WordleGrid({
  grid,
  currentRow,
  isGridSelected,
  canEditRow,
  onCellInput,
  onCellPaste,
  onCellKeyDown,
  onCellClick
}) {
  return (
    <div className="wordle-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="wordle-row">
          {row.map((cell, colIndex) => {
            const canEdit = canEditRow(rowIndex);
            const isConflict = hasConflictInGrid(grid, rowIndex, colIndex);
            const hint = getGreenLetterHint(grid, colIndex);
            const showHint =
              canEdit && !cell.letter && hint && rowIndex === currentRow;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="wordle-cell-wrapper"
              >
                {showHint && <div className="wordle-hint-overlay">{hint}</div>}
                <input
                  id={`cell-${rowIndex}-${colIndex}`}
                  type="text"
                  className={[
                    "wordle-cell",
                    showHint
                      ? "wordle-cell--hint"
                      : `wordle-cell--${cell.color}`,
                    isConflict
                      ? "wordle-cell--conflict"
                      : isGridSelected
                        ? "wordle-cell--selected"
                        : canEdit
                          ? "wordle-cell--editable"
                          : "wordle-cell--disabled"
                  ].join(" ")}
                  value={cell.letter}
                  maxLength={1}
                  disabled={!canEdit}
                  onChange={(event) => onCellInput(event, rowIndex, colIndex)}
                  onPaste={(event) => onCellPaste(event, rowIndex, colIndex)}
                  onKeyDown={(event) =>
                    onCellKeyDown(event, rowIndex, colIndex)
                  }
                  onClick={() => onCellClick(rowIndex, colIndex)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default WordleGrid;
