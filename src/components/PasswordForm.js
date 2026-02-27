import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { LanguageContext } from "../App";
import translations from "../translations";
import { findPossiblePasswords } from "../utils/findPossiblePasswords";

function PasswordForm() {
  const { language, setLanguage } = useContext(LanguageContext);
  const PASSWORD_LENGTH = 5;
  const MAX_ROWS = 6;

  const text = translations[language];

  const createEmptyGrid = () =>
    Array.from({ length: MAX_ROWS }, () =>
      Array.from({ length: PASSWORD_LENGTH }, () => ({
        letter: "",
        color: "gray"
      }))
    );

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

  const performSearch = useCallback(
    async (wordList) => {
      console.clear();

      if (dictionaryMode) {
        console.log("Dictionary Mode - Input String:", inputString);
        const passwords = wordList.filter((word) =>
          word.toLowerCase().startsWith(inputString.toLowerCase())
        );
        console.log("Possible Passwords:", passwords);
        setPossiblePasswords(passwords);
        setCurrentPage(1);
        return;
      }

      let queryString = Array(PASSWORD_LENGTH).fill("?");
      let bannedChars = "";
      let yellowLetters = Array(PASSWORD_LENGTH).fill("");

      for (let row = 0; row <= currentRow && row < MAX_ROWS; row++) {
        for (let col = 0; col < PASSWORD_LENGTH; col++) {
          const cell = grid[row][col];

          if (cell.color === "green" && cell.letter) {
            queryString[col] = cell.letter;
          } else if (cell.color === "yellow" && cell.letter) {
            if (!yellowLetters[col].includes(cell.letter)) {
              yellowLetters[col] += cell.letter;
            }
          } else if (cell.color === "gray" && cell.letter) {
            if (!bannedChars.includes(cell.letter)) {
              bannedChars += cell.letter;
            }
          }
        }
      }

      queryString = queryString.join("");

      console.log("Input String:", queryString);
      console.log("Banned Chars:", bannedChars);
      console.log("Yellow Letters:", yellowLetters);

      const passwords = findPossiblePasswords(
        queryString,
        bannedChars,
        yellowLetters,
        wordList,
        dictionaryMode
      );

      console.log("Possible Passwords:", passwords);

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
        console.log(
          `${language === "pl" ? "Polish" : "English"} words loaded.`
        );
        console.log("Number of words:", wordsArray.length);
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
    }
  }, [dictionaryMode]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const isRowComplete = (rowIndex) => {
    return grid[rowIndex].every((cell) => cell.letter !== "");
  };

  const isRowAllGreen = (rowIndex) => {
    return grid[rowIndex].every(
      (cell) => cell.color === "green" && cell.letter !== ""
    );
  };

  const canEditRow = (rowIndex) => {
    if (rowIndex === 0) return true;
    if (rowIndex > 0 && isRowAllGreen(rowIndex - 1)) {
      return false;
    }
    return isRowComplete(rowIndex - 1);
  };

  const hasConflict = (row, col) => {
    const currentCell = grid[row][col];
    if (currentCell.color !== "green" || !currentCell.letter) {
      return false;
    }

    for (let r = 0; r < MAX_ROWS; r++) {
      if (r === row) continue;
      const otherCell = grid[r][col];
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

  const hasAnyConflict = () => {
    for (let col = 0; col < PASSWORD_LENGTH; col++) {
      const greenLetters = new Set();
      for (let row = 0; row < MAX_ROWS; row++) {
        const cell = grid[row][col];
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

  useEffect(() => {
    const isRowCompleteLocal = (rowIndex) => {
      return grid[rowIndex].every((cell) => cell.letter !== "");
    };

    const isRowAllGreenLocal = (rowIndex) => {
      return grid[rowIndex].every(
        (cell) => cell.color === "green" && cell.letter !== ""
      );
    };

    const getFirstEmptyEditableCellLocal = () => {
      for (let row = 0; row < MAX_ROWS; row++) {
        const canEdit =
          row === 0 ||
          (!isRowAllGreenLocal(row - 1) && isRowCompleteLocal(row - 1));

        if (!canEdit) continue;

        for (let col = 0; col < PASSWORD_LENGTH; col++) {
          if (!grid[row][col].letter) {
            return { row, col };
          }
        }
      }

      return null;
    };

    const handleGlobalClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (!target.closest(".wordle-cell")) {
        setIsGridSelected(false);
      }

      if (dictionaryMode) {
        if (target === dictionaryInputRef.current) return;
        if (
          target.closest(
            "input, button, select, textarea, a, [contenteditable='true']"
          )
        ) {
          return;
        }

        setTimeout(() => {
          dictionaryInputRef.current?.focus();
        }, 0);
        return;
      }

      if (target.closest(".wordle-cell")) return;
      if (
        target.closest(
          "button, select, textarea, a, input[type='checkbox'], [contenteditable='true']"
        )
      ) {
        return;
      }

      const firstEmptyCell = getFirstEmptyEditableCellLocal();
      if (firstEmptyCell) {
        setTimeout(() => {
          document
            .getElementById(`cell-${firstEmptyCell.row}-${firstEmptyCell.col}`)
            ?.focus();
        }, 0);
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [dictionaryMode, grid]);

  const handleCellClick = (row, col) => {
    setIsGridSelected(false);

    if (!canEditRow(row)) return;

    if (grid[row][col].letter) {
      if (!dictionaryMode) {
        cycleColor(row, col);
      }
    } else {
      const hint = getGreenLetterHint(col);
      if (hint && row === currentRow) {
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
          newGrid[row][col].letter = hint;
          newGrid[row][col].color = "green";
          return newGrid;
        });

        if (col < PASSWORD_LENGTH - 1) {
          setTimeout(() => {
            document.getElementById(`cell-${row}-${col + 1}`)?.focus();
          }, 0);
        }
      } else {
        document.getElementById(`cell-${row}-${col}`)?.focus();
      }
    }
  };

  const getGreenLetterHint = (col) => {
    for (let row = 0; row < MAX_ROWS; row++) {
      const cell = grid[row][col];
      if (cell.color === "green" && cell.letter) {
        return cell.letter;
      }
    }
    return null;
  };

  const cycleColor = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      const cell = newGrid[row][col];

      if (cell.color === "gray") {
        cell.color = "yellow";
      } else if (cell.color === "yellow") {
        cell.color = "green";
      } else {
        cell.color = "gray";
      }

      return newGrid;
    });
  };

  const handleCellInput = (event, row, col) => {
    if (dictionaryMode || !canEditRow(row)) return;

    setIsGridSelected(false);

    const value = event.target.value.slice(-1).toLowerCase();

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      newGrid[row][col].letter = value;

      const isCurrentRowComplete = newGrid[row].every(
        (cell) => cell.letter !== ""
      );
      if (
        isCurrentRowComplete &&
        row === currentRow &&
        currentRow < MAX_ROWS - 1
      ) {
        setTimeout(() => setCurrentRow(row + 1), 0);
      }

      return newGrid;
    });

    if (value && col < PASSWORD_LENGTH - 1) {
      document.getElementById(`cell-${row}-${col + 1}`)?.focus();
    } else if (value && col === PASSWORD_LENGTH - 1 && row < MAX_ROWS - 1) {
      setTimeout(() => {
        document.getElementById(`cell-${row + 1}-0`)?.focus();
      }, 0);
    }
  };

  const handleCellKeyDown = (event, row, col) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setIsGridSelected(true);
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
        const typedValue = event.key.toLowerCase();
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
          for (let r = 0; r < MAX_ROWS; r++) {
            for (let c = 0; c < PASSWORD_LENGTH; c++) {
              newGrid[r][c].letter = "";
              newGrid[r][c].color = "gray";
            }
          }
          newGrid[0][0].letter = typedValue;
          return newGrid;
        });
        setCurrentRow(0);
        setIsGridSelected(false);
        setTimeout(() => {
          document.getElementById("cell-0-1")?.focus();
        }, 0);
        return;
      }

      setGrid(createEmptyGrid());
      setCurrentRow(0);
      setIsGridSelected(false);
      setTimeout(() => {
        document.getElementById("cell-0-0")?.focus();
      }, 0);
      return;
    }

    if (isGridSelected) {
      setIsGridSelected(false);
    }

    if (event.key === "Tab" || event.key === " ") {
      const hint = getGreenLetterHint(col);
      if (hint && !grid[row][col].letter) {
        event.preventDefault();
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
          newGrid[row][col].letter = hint;
          newGrid[row][col].color = "green";
          return newGrid;
        });

        if (col < PASSWORD_LENGTH - 1) {
          setTimeout(() => {
            document.getElementById(`cell-${row}-${col + 1}`)?.focus();
          }, 0);
        }
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
        const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
        newGrid[targetRow][targetCol].letter = "";
        newGrid[targetRow][targetCol].color = "gray";
        return newGrid;
      });

      setTimeout(() => {
        document.getElementById(`cell-${targetRow}-${targetCol}`)?.focus();
      }, 0);
    } else if (event.key === "Enter") {
      const isRowComplete = grid[row].every((cell) => cell.letter !== "");
      if (isRowComplete && row < MAX_ROWS - 1) {
        if (row >= currentRow) {
          setCurrentRow(row + 1);
        }
        setTimeout(() => {
          document.getElementById(`cell-${row + 1}-0`)?.focus();
        }, 0);
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
      <div className="wordle-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {row.map((cell, colIndex) => {
              const canEdit = canEditRow(rowIndex);
              const isConflict = hasConflict(rowIndex, colIndex);
              const hint = getGreenLetterHint(colIndex);
              const showHint =
                canEdit && !cell.letter && hint && rowIndex === currentRow;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{ position: "relative", display: "inline-block" }}
                >
                  {showHint && (
                    <div
                      className="wordle-hint"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999999",
                        opacity: 0.5,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        pointerEvents: "none",
                        zIndex: 1
                      }}
                    >
                      {hint}
                    </div>
                  )}
                  <input
                    id={`cell-${rowIndex}-${colIndex}`}
                    type="text"
                    className={`wordle-cell wordle-cell-${cell.color}`}
                    value={cell.letter}
                    maxLength={1}
                    disabled={!canEdit}
                    onChange={(event) =>
                      handleCellInput(event, rowIndex, colIndex)
                    }
                    onKeyDown={(event) =>
                      handleCellKeyDown(event, rowIndex, colIndex)
                    }
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      backgroundColor: showHint
                        ? "#6aaa6440"
                        : cell.color === "green"
                          ? "#6aaa64"
                          : cell.color === "yellow"
                            ? "#c9b458"
                            : "#787c7e",
                      color: cell.letter ? "#ffffff" : "#ffffff",
                      border: isConflict
                        ? "3px solid #d32f2f"
                        : isGridSelected
                          ? "3px solid #ffffff"
                          : canEdit
                            ? "2px solid #565758"
                            : "2px solid #3a3a3c",
                      cursor: canEdit ? "pointer" : "not-allowed"
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
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
              style={{ marginLeft: "10px" }}
            />
          </p>
        </label>
        <label>
          <p className="label-text">{text.languageToggle}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                value="pl"
                checked={language === "pl"}
                onChange={handleLanguageChange}
                style={{ transform: "scale(1.5)", accentColor: "green" }}
              />
              <span>polski</span>
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                value="en"
                checked={language === "en"}
                onChange={handleLanguageChange}
                style={{ transform: "scale(1.5)", accentColor: "green" }}
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
      {isLoading ? (
        <div className="loading-animation">{text.loading}</div>
      ) : !dictionaryMode && hasAnyConflict() ? (
        <div
          className="conflict-message"
          style={{
            padding: "20px",
            margin: "20px 0",
            backgroundColor: "#3a3a3c",
            border: "2px solid #d32f2f",
            borderRadius: "5px"
          }}
        >
          <h3 style={{ color: "#d32f2f", margin: 0 }}>
            {text.conflictDetected}
          </h3>
        </div>
      ) : (
        <>
          {possiblePasswords.length === 1 ? (
            <div
              style={{
                padding: "20px",
                margin: "20px 0",
                backgroundColor: "#3a3a3c",
                border: "3px solid #6aaa64",
                borderRadius: "5px"
              }}
            >
              <h3 style={{ color: "#6aaa64", margin: 0, fontSize: "1.5em" }}>
                {text.foundOnePassword(possiblePasswords[0])}
              </h3>
            </div>
          ) : currentPasswords.length > 0 ? (
            <div>
              <h3>{text.foundPasswords(possiblePasswords.length)}</h3>
              <ul>
                {currentPasswords.map((password, index) => (
                  <li key={index} className="password">
                    {password}
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="pagination">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(event) => {
                      const value = parseInt(event.target.value);
                      if (value >= 1 && value <= totalPages) {
                        changePage(value);
                      } else if (value > totalPages) {
                        changePage(totalPages);
                      } else {
                        changePage(1);
                      }
                    }}
                  />
                  <br />
                  <button
                    onClick={() => changePage(1)}
                    disabled={currentPage === 1}
                  >
                    |&lt;
                  </button>
                  <button
                    onClick={() => changePage(currentPage - 10)}
                    disabled={currentPage <= 10}
                  >
                    &lt;&lt;
                  </button>
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                  <button
                    onClick={() => changePage(currentPage + 10)}
                    disabled={currentPage >= totalPages - 10}
                  >
                    &gt;&gt;
                  </button>
                  <button
                    onClick={() => changePage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;|
                  </button>
                  <br />
                  <button
                    onClick={() =>
                      changePage(
                        Math.ceil(
                          possiblePasswords.length / passwordsPerPage / 4
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(possiblePasswords.length / passwordsPerPage / 4)
                    }
                  >
                    &#188;
                  </button>
                  <button
                    onClick={() =>
                      changePage(
                        Math.ceil(
                          possiblePasswords.length / passwordsPerPage / 2
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(possiblePasswords.length / passwordsPerPage / 2)
                    }
                  >
                    &#189;
                  </button>
                  <button
                    onClick={() =>
                      changePage(
                        Math.ceil(
                          (3 * possiblePasswords.length) / passwordsPerPage / 4
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(
                        (3 * possiblePasswords.length) / passwordsPerPage / 4
                      )
                    }
                  >
                    &#190;
                  </button>
                  <br />
                  <p>{text.page(currentPage, totalPages)}</p>
                </div>
              )}
            </div>
          ) : (
            <h3>{text.noPasswords}</h3>
          )}
        </>
      )}
    </div>
  );
}

export default PasswordForm;
