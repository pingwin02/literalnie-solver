export const PASSWORD_LENGTH = 5;
export const MAX_ROWS = 6;
export const NON_GRID_INTERACTIVE_SELECTOR =
  "input, button, select, textarea, a, [contenteditable='true']";

export const createEmptyGrid = () =>
  Array.from({ length: MAX_ROWS }, () =>
    Array.from({ length: PASSWORD_LENGTH }, () => ({
      letter: "",
      color: "gray"
    }))
  );

export const cloneGrid = (sourceGrid) =>
  sourceGrid.map((row) => row.map((cell) => ({ ...cell })));

export const normalizeLetters = (value) =>
  value.toLowerCase().replace(/[^a-ząćęłńóśźż]/gi, "");

const isRowCompleteInGrid = (gridData, rowIndex) => {
  return gridData[rowIndex].every((cell) => cell.letter !== "");
};

const isRowAllGreenInGrid = (gridData, rowIndex) => {
  return gridData[rowIndex].every(
    (cell) => cell.color === "green" && cell.letter !== ""
  );
};

export const canEditRowInGrid = (gridData, rowIndex) => {
  if (rowIndex === 0) return true;
  if (rowIndex > 0 && isRowAllGreenInGrid(gridData, rowIndex - 1)) {
    return false;
  }
  return isRowCompleteInGrid(gridData, rowIndex - 1);
};

export const getColumnLetterGroupColor = (
  gridData,
  colIndex,
  letter,
  ignoredRowIndex = null
) => {
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    if (rowIndex === ignoredRowIndex) {
      continue;
    }

    const cell = gridData[rowIndex][colIndex];
    if (cell.letter === letter && cell.color === "green") {
      return "green";
    }
  }

  return "gray";
};

export const applyColorToColumnLetterGroup = (
  gridData,
  rowIndex,
  colIndex,
  letter,
  color
) => {
  const isGreenInvolved =
    color === "green" || gridData[rowIndex][colIndex].color === "green";
  gridData[rowIndex][colIndex].color = color;

  if (isGreenInvolved) {
    for (let r = 0; r < MAX_ROWS; r++) {
      if (gridData[r][colIndex].letter === letter) {
        gridData[r][colIndex].color = color;
      }
    }
  }

  return gridData;
};

export const syncColumnLetterGroups = (gridData) => {
  const sharedColors = new Map();

  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < PASSWORD_LENGTH; colIndex++) {
      const cell = gridData[rowIndex][colIndex];

      if (!cell.letter) {
        continue;
      }

      const key = `${colIndex}:${cell.letter}`;
      if (!sharedColors.has(key) && cell.color === "green") {
        sharedColors.set(key, cell.color);
      }
    }
  }

  return gridData.map((row) =>
    row.map((cell, colIndex) => {
      if (!cell.letter) {
        return { ...cell, color: "gray" };
      }

      const sharedColor = sharedColors.get(`${colIndex}:${cell.letter}`);
      if (sharedColor === "green") {
        return { ...cell, color: "green" };
      }

      return { ...cell };
    })
  );
};

export const getNextEditablePosition = (gridData) => {
  for (let row = 0; row < MAX_ROWS; row++) {
    if (!canEditRowInGrid(gridData, row)) {
      continue;
    }

    for (let col = 0; col < PASSWORD_LENGTH; col++) {
      if (!gridData[row][col].letter) {
        return { row, col };
      }
    }
  }

  return null;
};

export const getNextCurrentRow = (gridData) => {
  const nextEditablePosition = getNextEditablePosition(gridData);

  if (nextEditablePosition) {
    return nextEditablePosition.row;
  }

  for (let row = MAX_ROWS - 1; row >= 0; row--) {
    if (canEditRowInGrid(gridData, row)) {
      return row;
    }
  }

  return 0;
};

export const getNextPositionAfterCell = (gridData, row, col) => {
  for (let nextCol = col + 1; nextCol < PASSWORD_LENGTH; nextCol++) {
    if (!gridData[row][nextCol].letter) {
      return { row, col: nextCol };
    }
  }

  for (let nextRow = row + 1; nextRow < MAX_ROWS; nextRow++) {
    if (!canEditRowInGrid(gridData, nextRow)) {
      continue;
    }

    for (let nextCol = 0; nextCol < PASSWORD_LENGTH; nextCol++) {
      if (!gridData[nextRow][nextCol].letter) {
        return { row: nextRow, col: nextCol };
      }
    }
  }

  return null;
};

export const getLastFilledEditablePosition = (gridData) => {
  for (let row = MAX_ROWS - 1; row >= 0; row--) {
    if (!canEditRowInGrid(gridData, row)) {
      continue;
    }

    for (let col = PASSWORD_LENGTH - 1; col >= 0; col--) {
      if (gridData[row][col].letter) {
        return { row, col };
      }
    }
  }

  return { row: 0, col: 0 };
};

export const getArrowNavigationPosition = (gridData, row, col, key) => {
  const directions = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  };

  const direction = directions[key];
  if (!direction) {
    return null;
  }

  const [rowDelta, colDelta] = direction;
  let nextRow = row + rowDelta;
  let nextCol = col + colDelta;

  while (
    nextRow >= 0 &&
    nextRow < MAX_ROWS &&
    nextCol >= 0 &&
    nextCol < PASSWORD_LENGTH
  ) {
    if (canEditRowInGrid(gridData, nextRow)) {
      return { row: nextRow, col: nextCol };
    }

    nextRow += rowDelta;
    nextCol += colDelta;
  }

  return null;
};

export const getGreenLetterHint = (gridData, col) => {
  for (let row = 0; row < MAX_ROWS; row++) {
    const cell = gridData[row][col];
    if (cell.color === "green" && cell.letter) {
      return cell.letter;
    }
  }
  return null;
};

export const hasConflictInGrid = (gridData, row, col) => {
  const currentCell = gridData[row][col];
  if (currentCell.color !== "green" || !currentCell.letter) {
    return false;
  }

  for (let otherRow = 0; otherRow < MAX_ROWS; otherRow++) {
    if (otherRow === row) {
      continue;
    }

    const otherCell = gridData[otherRow][col];
    if (
      otherCell.color === "green" &&
      otherCell.letter &&
      otherCell.letter !== currentCell.letter
    ) {
      return true;
    }
  }

  return false;
};

export const hasAnyConflictInGrid = (gridData) => {
  for (let col = 0; col < PASSWORD_LENGTH; col++) {
    const greenLetters = new Set();
    for (let row = 0; row < MAX_ROWS; row++) {
      const cell = gridData[row][col];
      if (cell.color === "green" && cell.letter) {
        if (greenLetters.size > 0 && !greenLetters.has(cell.letter)) {
          return true;
        }
        greenLetters.add(cell.letter);
      }
    }
  }

  return false;
};
