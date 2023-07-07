import React, { useState, useEffect } from "react";

function PasswordForm() {
  const [inputString, setInputString] = useState("");
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

  const handleSubmit = async (event) => {
    console.clear();
    event.preventDefault();
    console.log("Input String:", inputString);
    console.log("Banned Chars:", bannedChars);
    console.log("Must Contain:", mustContain);
    console.log("Dictionary Mode:", dictionaryMode);
    setIsLoading(true);
    const passwords = findPossiblePasswords(
      inputString,
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

  return (
    <div className="password-form">
      <div className="form-inputs">
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
