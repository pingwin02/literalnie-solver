import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { LanguageContext } from "../App";
import translations from "../translations";
import WordleGrid from "./WordleGrid";
import PasswordResults from "./PasswordResults";
import { findPossiblePasswords } from "../utils/findPossiblePasswords";
import {
  PASSWORD_LENGTH,
  MAX_ROWS,
  NON_GRID_INTERACTIVE_SELECTOR,
  createEmptyGrid,
  cloneGrid,
  normalizeLetters,
  canEditRowInGrid,
  getColumnLetterGroupColor,
  applyColorToColumnLetterGroup,
  syncColumnLetterGroups,
  getNextEditablePosition,
  getNextCurrentRow,
  getNextPositionAfterCell,
  getLastFilledEditablePosition,
  getArrowNavigationPosition,
  getGreenLetterHint,
  hasAnyConflictInGrid
} from "../utils/passwordGrid";
import "../styles/PasswordForm.css";

function PasswordForm() {
  const { language, setLanguage } = useContext(LanguageContext);

  const text = translations[language];

  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentRow, setCurrentRow] = useState(0);
  const [inputString, setInputString] = useState("");
  const [possiblePasswords, setPossiblePasswords] = useState([]);
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [passwordsPerPage] = useState(40);
  const [dictionaryMode, setDictionaryMode] = useState(false);
  const [isGridSelected, setIsGridSelected] = useState(false);
  const dictionaryInputRef = useRef(null);
  const isGridSelectedRef = useRef(false);

  useEffect(() => {
    isGridSelectedRef.current = isGridSelected;
  }, [isGridSelected]);

  const focusCell = useCallback((row, col) => {
    setTimeout(() => {
      document.getElementById(`cell-${row}-${col}`)?.focus();
    }, 0);
  }, []);

  const resetGridSelection = useCallback(
    (typedValue = "") => {
      const newGrid = createEmptyGrid();

      if (typedValue) {
        newGrid[0][0].letter = typedValue;
      }

      setGrid(newGrid);
      setCurrentRow(0);
      setIsGridSelected(false);
      focusCell(0, typedValue ? 1 : 0);
    },
    [focusCell]
  );

  const performSearch = useCallback(
    async (wordList) => {
      if (dictionaryMode) {
        const passwords = findPossiblePasswords({
          guesses: [],
          words: wordList,
          dictionaryMode,
          inputString
        });
        setPossiblePasswords(passwords);
        setCurrentPage(1);
        return;
      }

      const guesses = grid
        .slice(0, Math.min(currentRow + 1, MAX_ROWS))
        .filter((row) => row.some((cell) => cell.letter));

      const passwords = findPossiblePasswords({
        guesses,
        words: wordList,
        dictionaryMode
      });

      setPossiblePasswords(passwords);
      setCurrentPage(1);
    },
    [grid, currentRow, dictionaryMode, inputString]
  );

  useEffect(() => {
    setIsLoading(true);
    const dictionaryFile =
      language === "pl" ? "/slownik.txt" : "/dictionary.txt";
    fetch(process.env.PUBLIC_URL + dictionaryFile)
      .then((response) => response.text())
      .then((data) => {
        const wordsArray = data.trim().split("\n");
        setWords(wordsArray);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [language]);

  useEffect(() => {
    if (words && words.length > 0) {
      performSearch(words);
    }
  }, [performSearch, words]);

  useEffect(() => {
    if (dictionaryMode) {
      setGrid(createEmptyGrid());
      setCurrentRow(0);
      setInputString("");
      setTimeout(() => dictionaryInputRef.current?.focus(), 0);
    } else {
      focusCell(0, 0);
    }
  }, [dictionaryMode, focusCell]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    if (dictionaryMode) {
      setTimeout(() => dictionaryInputRef.current?.focus(), 0);
    } else {
      const pos = getNextEditablePosition(grid) ?? { row: 0, col: 0 };
      focusCell(pos.row, pos.col);
    }
  };

  const canEditRow = (rowIndex) => {
    return canEditRowInGrid(grid, rowIndex);
  };

  useEffect(() => {
    const handleGlobalClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (!target.closest(".wordle-cell")) {
        setIsGridSelected(false);
      }

      const isMobile =
        window.innerWidth <= 550 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (dictionaryMode) {
        if (target === dictionaryInputRef.current) return;
        if (
          target.closest(
            "input, button, select, textarea, a, [contenteditable='true']"
          )
        ) {
          return;
        }

        if (isMobile) return;

        setTimeout(() => {
          dictionaryInputRef.current?.focus();
        }, 0);
        return;
      }

      if (target.closest(".wordle-cell")) return;
      if (target.closest(NON_GRID_INTERACTIVE_SELECTOR)) {
        return;
      }

      if (isMobile) return;

      const firstEmptyCell = getNextEditablePosition(grid);
      if (firstEmptyCell) {
        focusCell(firstEmptyCell.row, firstEmptyCell.col);
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [dictionaryMode, focusCell, grid]);

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        const isBlockedTextInput =
          target instanceof HTMLInputElement &&
          !target.classList.contains("wordle-cell") &&
          [
            "text",
            "search",
            "email",
            "url",
            "tel",
            "password",
            "number"
          ].includes(target.type);

        if (
          dictionaryMode ||
          isBlockedTextInput ||
          target.closest("textarea, [contenteditable='true']")
        ) {
          return;
        }

        event.preventDefault();
        setIsGridSelected(true);

        const targetPosition =
          getNextEditablePosition(grid) ?? getLastFilledEditablePosition(grid);
        focusCell(targetPosition.row, targetPosition.col);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
        if (!target.classList.contains("wordle-cell")) return;
        const rowsToCopy = grid.filter((row) =>
          row.some((cell) => cell.letter)
        );
        const jsonRows = rowsToCopy.map((row) =>
          row.map((cell) => ({ l: cell.letter, c: cell.color }))
        );
        const jsonExport = {
          grid: jsonRows,
          language
        };
        const jsonText = JSON.stringify(jsonExport);
        if (jsonText) {
          event.preventDefault();
          navigator.clipboard.writeText(jsonText);
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [dictionaryMode, focusCell, grid, currentRow, language]);

  const handleCellClick = (row, col) => {
    setIsGridSelected(false);

    if (!canEditRow(row)) return;

    if (grid[row][col].letter) {
      if (!dictionaryMode) {
        cycleColor(row, col);
      }
    } else {
      const hint = getGreenLetterHint(grid, col);
      if (hint && row === currentRow) {
        let nextPosition = null;
        let nextRow = currentRow;

        setGrid((prevGrid) => {
          const newGrid = cloneGrid(prevGrid);
          newGrid[row][col].letter = hint;
          const updatedGrid = applyColorToColumnLetterGroup(
            newGrid,
            row,
            col,
            hint,
            "green"
          );
          nextPosition = getNextPositionAfterCell(updatedGrid, row, col);
          nextRow = getNextCurrentRow(updatedGrid);
          return updatedGrid;
        });

        setTimeout(() => {
          setCurrentRow(nextRow);
          const targetPosition = nextPosition ?? { row: nextRow, col: 0 };
          focusCell(targetPosition.row, targetPosition.col);
        }, 0);
      } else {
        document.getElementById(`cell-${row}-${col}`)?.focus();
      }
    }
  };

  const cycleColor = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = cloneGrid(prevGrid);
      const cell = newGrid[row][col];
      let nextColor = "gray";

      if (cell.color === "gray") {
        nextColor = "yellow";
      } else if (cell.color === "yellow") {
        nextColor = "green";
      }

      return applyColorToColumnLetterGroup(
        newGrid,
        row,
        col,
        cell.letter,
        nextColor
      );
    });
  };

  const handleCellInput = (event, row, col) => {
    if (dictionaryMode || !canEditRow(row)) return;

    setIsGridSelected(false);

    const value = normalizeLetters(event.target.value).slice(-1);
    let nextPosition = null;
    let nextRow = currentRow;

    setGrid((prevGrid) => {
      const newGrid = cloneGrid(prevGrid);
      newGrid[row][col].letter = value;
      newGrid[row][col].color = value
        ? getColumnLetterGroupColor(newGrid, col, value, row)
        : "gray";

      const isCurrentRowComplete = newGrid[row].every(
        (cell) => cell.letter !== ""
      );
      if (
        isCurrentRowComplete &&
        row === currentRow &&
        currentRow < MAX_ROWS - 1
      ) {
        nextRow = row + 1;
      } else {
        nextRow = getNextCurrentRow(newGrid);
      }

      const syncedGrid = syncColumnLetterGroups(newGrid);
      nextPosition = value
        ? getNextPositionAfterCell(syncedGrid, row, col)
        : null;
      if (
        !isCurrentRowComplete ||
        row !== currentRow ||
        currentRow >= MAX_ROWS - 1
      ) {
        nextRow = getNextCurrentRow(syncedGrid);
      }
      return syncedGrid;
    });

    if (value) {
      setTimeout(() => {
        setCurrentRow(nextRow);
        const targetPosition = nextPosition ?? { row, col };
        focusCell(targetPosition.row, targetPosition.col);
      }, 0);
    }
  };

  const handleCellPaste = (event, row, col) => {
    if (dictionaryMode) {
      return;
    }

    const wasGridSelected = isGridSelected;

    const pastedText = event.clipboardData.getData("text");
    let parsedObj = null;
    let isValidJsonGrid = false;
    let pastedLanguage = null;
    try {
      parsedObj = JSON.parse(pastedText);
      if (
        parsedObj &&
        typeof parsedObj === "object" &&
        Array.isArray(parsedObj.grid)
      ) {
        isValidJsonGrid = parsedObj.grid.every(
          (row) =>
            Array.isArray(row) &&
            row.every(
              (cell) => typeof cell === "object" && "l" in cell && "c" in cell
            )
        );
        pastedLanguage = parsedObj.language;
      } else {
        isValidJsonGrid =
          Array.isArray(parsedObj) &&
          parsedObj.every(
            (row) =>
              Array.isArray(row) &&
              row.every(
                (cell) => typeof cell === "object" && "l" in cell && "c" in cell
              )
          );
      }
    } catch (e) {
      parsedObj = null;
      isValidJsonGrid = false;
    }
    event.preventDefault();
    setIsGridSelected(false);
    const startRow = wasGridSelected ? 0 : row;
    let nextPosition = null;
    let nextRow = currentRow;
    if (isValidJsonGrid && pastedLanguage) {
      setLanguage(pastedLanguage);
    }
    setGrid((prevGrid) => {
      const newGrid = wasGridSelected ? createEmptyGrid() : cloneGrid(prevGrid);
      let gridRows = null;
      if (isValidJsonGrid) {
        gridRows = parsedObj.grid || parsedObj;
        let targetRow = startRow;
        for (const rowArr of gridRows) {
          if (
            targetRow >= MAX_ROWS ||
            (!wasGridSelected && !canEditRowInGrid(newGrid, targetRow))
          ) {
            break;
          }
          for (let targetCol = 0; targetCol < PASSWORD_LENGTH; targetCol++) {
            const cell = rowArr[targetCol] || {};
            newGrid[targetRow][targetCol].letter = cell.l || "";
            newGrid[targetRow][targetCol].color = cell.c || "gray";
          }
          targetRow += 1;
        }
      } else {
        const rowsToPaste = pastedText
          .split(/\r?\n+/)
          .map((word) => normalizeLetters(word))
          .filter(Boolean);
        if (rowsToPaste.length > 0) {
          let targetRow = startRow;
          for (const word of rowsToPaste) {
            if (
              targetRow >= MAX_ROWS ||
              (!wasGridSelected && !canEditRowInGrid(newGrid, targetRow))
            ) {
              break;
            }
            for (let targetCol = 0; targetCol < PASSWORD_LENGTH; targetCol++) {
              const letter = word[targetCol] ?? "";
              newGrid[targetRow][targetCol].letter = letter;
              newGrid[targetRow][targetCol].color = "gray";
            }
            targetRow += 1;
          }
        }
      }
      const syncedGrid = syncColumnLetterGroups(newGrid);
      nextPosition = getNextEditablePosition(syncedGrid);
      nextRow = getNextCurrentRow(syncedGrid);
      return syncedGrid;
    });
    setTimeout(() => {
      setCurrentRow(nextRow);
      const targetPosition = nextPosition ?? { row: nextRow, col: 0 };
      focusCell(targetPosition.row, targetPosition.col);
    }, 0);
  };

  const handleCellKeyDown = (event, row, col) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setIsGridSelected(true);
      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key.toLowerCase() === "c" || event.key.toLowerCase() === "v")
    ) {
      return;
    }

    const arrowTargetPosition = getArrowNavigationPosition(
      grid,
      row,
      col,
      event.key
    );

    if (arrowTargetPosition) {
      event.preventDefault();
      setIsGridSelected(false);
      focusCell(arrowTargetPosition.row, arrowTargetPosition.col);
      return;
    }

    if (
      isGridSelected &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (event.key.length === 1) {
        resetGridSelection(normalizeLetters(event.key).slice(-1));
        return;
      }

      resetGridSelection();
      return;
    }

    if (isGridSelected && !event.ctrlKey && !event.metaKey) {
      setIsGridSelected(false);
    }

    if (event.key === "Tab" || event.key === " ") {
      const hint = getGreenLetterHint(grid, col);
      if (hint && !grid[row][col].letter) {
        event.preventDefault();
        let nextPosition = null;
        let nextRow = currentRow;

        setGrid((prevGrid) => {
          const newGrid = cloneGrid(prevGrid);
          newGrid[row][col].letter = hint;
          const updatedGrid = applyColorToColumnLetterGroup(
            newGrid,
            row,
            col,
            hint,
            "green"
          );
          nextPosition = getNextPositionAfterCell(updatedGrid, row, col);
          nextRow = getNextCurrentRow(updatedGrid);
          return updatedGrid;
        });

        setTimeout(() => {
          setCurrentRow(nextRow);
          const targetPosition = nextPosition ?? { row: nextRow, col: 0 };
          focusCell(targetPosition.row, targetPosition.col);
        }, 0);
      }
    } else if (event.key === "Backspace") {
      event.preventDefault();

      let targetRow = row;
      let targetCol = col;

      if (!grid[row][col].letter) {
        if (col > 0) {
          targetCol = col - 1;
        } else if (row > 0) {
          targetRow = row - 1;
          targetCol = PASSWORD_LENGTH - 1;
        }
      }

      setGrid((prevGrid) => {
        const newGrid = cloneGrid(prevGrid);
        newGrid[targetRow][targetCol].letter = "";
        newGrid[targetRow][targetCol].color = "gray";
        return syncColumnLetterGroups(newGrid);
      });

      focusCell(targetRow, targetCol);
    } else if (event.key === "Enter") {
      const isRowComplete = grid[row].every((cell) => cell.letter !== "");
      if (isRowComplete && row < MAX_ROWS - 1) {
        if (row >= currentRow) {
          setCurrentRow(row + 1);
        }
        focusCell(row + 1, 0);
      }
    }
  };

  const handleScrollBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const indexOfLastPassword = currentPage * passwordsPerPage;
  const indexOfFirstPassword = indexOfLastPassword - passwordsPerPage;
  const currentPasswords = possiblePasswords.slice(
    indexOfFirstPassword,
    indexOfLastPassword
  );
  const totalPages = Math.ceil(possiblePasswords.length / passwordsPerPage);

  const renderInputFields = () => {
    if (dictionaryMode) {
      return (
        <label>
          <p className="label-text">{text.enterPassword}</p>
          <input
            type="text"
            ref={dictionaryInputRef}
            value={inputString}
            onChange={(event) =>
              setInputString(event.target.value.toLowerCase())
            }
          />
        </label>
      );
    }

    return (
      <WordleGrid
        grid={grid}
        currentRow={currentRow}
        isGridSelected={isGridSelected}
        canEditRow={canEditRow}
        onCellInput={handleCellInput}
        onCellPaste={handleCellPaste}
        onCellKeyDown={handleCellKeyDown}
        onCellClick={handleCellClick}
      />
    );
  };

  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      }, 50);
    }
  };

  return (
    <div className="password-form">
      <div className="form-inputs">
        <label className="dictionary-toggle-label">
          <p className="label-text">
            {text.dictionaryMode}
            <input
              type="checkbox"
              checked={dictionaryMode}
              onChange={(event) => setDictionaryMode(event.target.checked)}
            />
          </p>
        </label>
        <label>
          <p className="label-text">{text.languageToggle}</p>
          <div className="language-toggle">
            <label className="language-option">
              <input
                type="radio"
                className="language-radio"
                value="pl"
                checked={language === "pl"}
                onChange={handleLanguageChange}
              />
              <span>polski</span>
            </label>
            <label className="language-option">
              <input
                type="radio"
                className="language-radio"
                value="en"
                checked={language === "en"}
                onChange={handleLanguageChange}
              />
              <span>english</span>
            </label>
          </div>
        </label>
        <div className={dictionaryMode ? "dictionary-input-wrapper" : ""}>
          {renderInputFields()}
        </div>
      </div>
      <div
        className={`mobileButton ${
          dictionaryMode ? "mobileButton--dictionary" : ""
        }`}
      >
        <button onClick={handleScrollBottom}>
          {text.homePage.scrollBottom}
        </button>
      </div>
      <PasswordResults
        dictionaryMode={dictionaryMode}
        isLoading={isLoading}
        hasAnyConflict={hasAnyConflictInGrid(grid)}
        text={text}
        possiblePasswords={possiblePasswords}
        currentPasswords={currentPasswords}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={changePage}
      />
    </div>
  );
}

export default PasswordForm;
