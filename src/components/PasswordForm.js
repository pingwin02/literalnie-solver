import React, { useState, useEffect } from "react";

function PasswordForm() {
  const PASSWORD_LENGTH = 5;

  const [inputString, setInputString] = useState("");
  const [inputLetters, setInputLetters] = useState(
    Array.from({ length: PASSWORD_LENGTH }, () => "")
  );

  const [bannedChars, setBannedChars] = useState("");
  const [mustContain, setMustContain] = useState("");
  const [possiblePasswords, setPossiblePasswords] = useState([]);
  const [polishWords, setPolishWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [passwordsPerPage] = useState(40);
  const [dictionaryMode, setDictionaryMode] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(process.env.PUBLIC_URL + "/slownik.txt")
      .then((response) => response.text())
      .then((data) => {
        const words = data.trim().split("\n");
        console.log("Polish words (slownik.txt) loaded.");
        console.log("Number of words:", words.length);
        setPolishWords(words);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (dictionaryMode) {
      setBannedChars("");
      setMustContain("");
      setInputString("");
    } else {
      setInputLetters(Array.from({ length: PASSWORD_LENGTH }, () => ""));
    }
  }, [dictionaryMode]);

  const findPossiblePasswords = (
    inputString,
    bannedChars,
    mustContain,
    words
  ) => {
    const possiblePasswords = [];

    for (const word of words) {
      if (word.length === inputString.length || dictionaryMode) {
        let matches = true;
        for (let i = 0; i < inputString.length && matches; i++) {
          if (
            (inputString[i] !== "?" && inputString[i] !== word[i]) ||
            (!dictionaryMode &&
              inputString[i] === "?" &&
              bannedChars.includes(word[i]))
          ) {
            matches = false;
          }
        }
        if (
          matches &&
          (mustContain === "" ||
            dictionaryMode ||
            mustContain.split("").every((char) => {
              const regex = new RegExp(char, "g");
              const matches = (word.match(regex) || []).length;
              const mustContainMatches = (mustContain.match(regex) || [])
                .length;
              if (inputString.includes(char)) {
                return matches > mustContainMatches;
              }
              return matches >= mustContainMatches;
            }))
        ) {
          possiblePasswords.push(word);
        }
      }
    }

    return possiblePasswords;
  };

  const handleInput = (event, index) => {
    if (event.target.value.length > 1) {
      event.target.value = event.target.value.slice(-1);
    }
    setInputLetters((prev) => {
      const newLetters = [...prev];
      newLetters[index] = event.target.value.toLowerCase();
      return newLetters;
    });
  };

  const handleKeyUp = (event, index) => {
    if (event.key === "Backspace") {
      document.getElementById(`input-${index - 1}`)?.focus();
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode === 229
    ) {
      if (index < PASSWORD_LENGTH - 1) {
        document.getElementById(`input-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (event) => {
    console.clear();
    event.preventDefault();
    let query = "";
    if (dictionaryMode) {
      query = inputString;
    } else {
      for (const letter of inputLetters) {
        query += letter === "" ? "?" : letter;
      }
    }
    console.log("Input String:", query);
    console.log("Banned Chars:", bannedChars);
    console.log("Must Contain:", mustContain);
    console.log("Dictionary Mode:", dictionaryMode);
    setIsLoading(true);
    const passwords = findPossiblePasswords(
      query,
      bannedChars,
      mustContain,
      polishWords
    );
    console.log("Possible Passwords:", passwords);
    setPossiblePasswords(passwords);
    setIsLoading(false);
    setCurrentPage(1);
    await new Promise((resolve) => setTimeout(resolve, 100));
    // skocz na dół strony z animacją
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // Obliczanie indeksu pierwszego i ostatniego hasła na danej stronie
  const indexOfLastPassword = currentPage * passwordsPerPage;
  const indexOfFirstPassword = indexOfLastPassword - passwordsPerPage;
  const currentPasswords = possiblePasswords.slice(
    indexOfFirstPassword,
    indexOfLastPassword
  );

  // Funkcja do zmiany strony
  const changePage = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(possiblePasswords.length / passwordsPerPage)
    ) {
      setCurrentPage(pageNumber);
      // poczekaj 50ms, aż się zaktualizuje currentPage
      setTimeout(() => {
        // skocz na dół strony z animacją
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  };

  const renderInputFields = () => {
    if (!dictionaryMode) {
      return (
        <>
          <label>
            <p className="label-text">Podaj hasło:</p>
          </label>
          <br />
          {[...Array(PASSWORD_LENGTH)].map((_, index) => (
            <label key={index}>
              <input
                id={`input-${index}`}
                type="text"
                className="password-input"
                value={inputLetters[index]}
                placeholder="?"
                maxLength={1}
                onChange={(event) => {
                  handleInput(event, index);
                }}
                onKeyUp={(event) => {
                  handleKeyUp(event, index);
                }}
              />
            </label>
          ))}
        </>
      );
    } else {
      return (
        <label>
          <p className="label-text">Podaj hasło:</p>
          <input
            type="text"
            value={inputString}
            onChange={(event) =>
              setInputString(event.target.value.toLowerCase())
            }
          />
        </label>
      );
    }
  };

  return (
    <div className="password-form">
      <div className="form-inputs">
        {renderInputFields()}
        <br />
        <label>
          <p className="label-text">Podaj litery do zbanowania:</p>
          <input
            type="text"
            value={bannedChars}
            onChange={(event) =>
              setBannedChars(event.target.value.toLowerCase())
            }
            disabled={dictionaryMode}
          />
        </label>
        <br />
        <label>
          <p className="label-text">
            Podaj litery, <br />
            które muszą się znaleźć w haśle:
          </p>
          <input
            type="text"
            value={mustContain}
            onChange={(event) =>
              setMustContain(event.target.value.toLowerCase())
            }
            disabled={dictionaryMode}
          />
        </label>
        <br />
        <label>
          <p className="label-text">
            Tryb słownikowy:
            <input
              type="checkbox"
              checked={dictionaryMode}
              onChange={(event) => setDictionaryMode(event.target.checked)}
            />
          </p>
        </label>
      </div>
      <button type="button" onClick={handleSubmit} disabled={isLoading}>
        Szukaj
      </button>
      <br />
      {isLoading ? (
        <div className="loading-animation">Ładowanie...</div>
      ) : (
        <>
          {currentPasswords.length > 0 ? (
            <div>
              <h3>Znalazłem {possiblePasswords.length} możliwych haseł:</h3>
              <ul>
                {currentPasswords.map((password, index) => (
                  <li key={index} className="password">
                    {password}
                  </li>
                ))}
              </ul>
              {/* Paginacja */}
              <div className="pagination">
                <input
                  type="number"
                  min="1"
                  max={Math.ceil(possiblePasswords.length / passwordsPerPage)}
                  value={currentPage}
                  onChange={(event) => {
                    const value = parseInt(event.target.value);
                    if (
                      value >= 1 &&
                      value <=
                        Math.ceil(possiblePasswords.length / passwordsPerPage)
                    ) {
                      changePage(value);
                    } else if (
                      value >
                      Math.ceil(possiblePasswords.length / passwordsPerPage)
                    ) {
                      changePage(
                        Math.ceil(possiblePasswords.length / passwordsPerPage)
                      );
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
                  disabled={
                    currentPage ===
                    Math.ceil(possiblePasswords.length / passwordsPerPage)
                  }
                >
                  &gt;
                </button>
                <button
                  onClick={() => changePage(currentPage + 10)}
                  disabled={
                    currentPage >=
                    Math.ceil(possiblePasswords.length / passwordsPerPage) - 10
                  }
                >
                  &gt;&gt;
                </button>
                <button
                  onClick={() =>
                    changePage(
                      Math.ceil(possiblePasswords.length / passwordsPerPage)
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(possiblePasswords.length / passwordsPerPage)
                  }
                >
                  &gt;|
                </button>
                <br />
                <button
                  onClick={() =>
                    changePage(
                      Math.ceil(possiblePasswords.length / passwordsPerPage / 4)
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
                      Math.ceil(possiblePasswords.length / passwordsPerPage / 2)
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
                <p>
                  Strona {currentPage} z{" "}
                  {Math.ceil(possiblePasswords.length / passwordsPerPage)}
                </p>
              </div>
            </div>
          ) : (
            <h3>Brak możliwych haseł dla podanych ograniczeń.</h3>
          )}
        </>
      )}
    </div>
  );
}

export default PasswordForm;
