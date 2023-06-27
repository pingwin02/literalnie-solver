import React, { useState, useEffect } from "react";
import "./PasswordForm.css";

function PasswordForm() {
  const [inputString, setInputString] = useState("");
  const [bannedChars, setBannedChars] = useState("");
  const [mustContain, setMustContain] = useState("");
  const [possiblePasswords, setPossiblePasswords] = useState([]);
  const [polishWords, setPolishWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [passwordsPerPage] = useState(30);
  const [dictionaryMode, setDictionaryMode] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/odm.txt")
      .then((response) => response.text())
      .then((data) => {
        console.clear();
        console.log("Polish words (odm.txt) loaded.");
        const words = getPolishWords(data);
        setPolishWords(words);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const getPolishWords = (odmText) => {
    const words = new Set();
    const lines = odmText.trim().split("\n");
    for (const line of lines) {
      const word = line.split(",")[0].trim();
      if (/^[a-z]+$/.test(word)) {
        words.add(word);
      }
    }
    return words;
  };

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
        for (let i = 0; i < inputString.length; i++) {
          if (
            (inputString[i] !== "_" && inputString[i] !== word[i]) ||
            (inputString[i] === "_" && bannedChars.includes(word[i]))
          ) {
            matches = false;
            break;
          }
        }
        if (
          matches &&
          (mustContain === "" ||
            mustContain.split("").every((char) => word.includes(char)))
        ) {
          possiblePasswords.push(word);
        }
      }
    }

    return possiblePasswords;
  };

  const handleSubmit = async (event) => {
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
          Podaj ciąg znaków:
          <br />
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
          Podaj litery do zbanowania:
          <br />
          <input
            type="text"
            value={bannedChars}
            onChange={(event) =>
              setBannedChars(event.target.value.toLowerCase())
            }
          />
        </label>
        <br />
        <label>
          Podaj litery, które muszą się znaleźć w haśle:
          <br />
          <input
            type="text"
            value={mustContain}
            onChange={(event) =>
              setMustContain(event.target.value.toLowerCase())
            }
          />
        </label>
        <br />
        <label>
          Tryb słownikowy:
          <input
            type="checkbox"
            checked={dictionaryMode}
            onChange={(event) => setDictionaryMode(event.target.checked)}
          />
        </label>
      </div>
      <br />
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
              <p>Znalazłem {possiblePasswords.length} możliwych haseł:</p>
              <ul
                style={{
                  display: "inline-block",
                }}
              >
                {currentPasswords.map((password, index) => (
                  <li key={index}>{password}</li>
                ))}
              </ul>
              {/* Paginacja */}
              <div className="pagination">
                <button
                  onClick={() => changePage(1)}
                  disabled={currentPage === 1}
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
                  onChange={(event) => changePage(parseInt(event.target.value))}
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
                  &gt;&gt;
                </button>
              </div>
            </div>
          ) : (
            <p>Brak możliwych haseł dla podanych ograniczeń.</p>
          )}
        </>
      )}
    </div>
  );
}

export default PasswordForm;
