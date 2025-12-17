import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../App";
import translations from "../translations";
import { findPossiblePasswords } from "../utils/findPossiblePasswords";

function PasswordForm() {
  const { language, setLanguage } = useContext(LanguageContext);
  const PASSWORD_LENGTH = 5;

  const [inputString, setInputString] = useState("");
  const [inputLetters, setInputLetters] = useState(
    Array.from({ length: PASSWORD_LENGTH }, () => "")
  );

  const [bannedChars, setBannedChars] = useState("");
  const [mustContain, setMustContain] = useState("");
  const [possiblePasswords, setPossiblePasswords] = useState([]);
  const [words, setWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [passwordsPerPage] = useState(40);
  const [dictionaryMode, setDictionaryMode] = useState(false);

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
    if (dictionaryMode) {
      setBannedChars("");
      setMustContain("");
      setInputString("");
    } else {
      setInputLetters(Array.from({ length: PASSWORD_LENGTH }, () => ""));
    }
  }, [dictionaryMode]);

  useEffect(() => {
    setPossiblePasswords([]);
    setCurrentPage(1);
  }, [language]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
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
      words,
      dictionaryMode
    );
    console.log("Possible Passwords:", passwords);
    setPossiblePasswords(passwords);
    setIsLoading(false);
    setCurrentPage(1);
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  const indexOfLastPassword = currentPage * passwordsPerPage;
  const indexOfFirstPassword = indexOfLastPassword - passwordsPerPage;
  const currentPasswords = possiblePasswords.slice(
    indexOfFirstPassword,
    indexOfLastPassword
  );

  const renderInputFields = () => {
    if (!dictionaryMode) {
      return (
        <>
          <label>
            <p className="label-text">{translations[language].enterPassword}</p>
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
          <p className="label-text">{translations[language].enterPassword}</p>
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

  const changePage = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(possiblePasswords.length / passwordsPerPage)
    ) {
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
        {renderInputFields()}
        <br />
        <label>
          <p className="label-text">{translations[language].bannedChars}</p>
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
          <p className="label-text">{translations[language].mustContain}</p>
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
            {translations[language].dictionaryMode}
            <input
              type="checkbox"
              checked={dictionaryMode}
              onChange={(event) => setDictionaryMode(event.target.checked)}
            />
          </p>
        </label>
        <br />
        <label>
          <p className="label-text">{translations[language].languageToggle}</p>
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
      </div>
      <button type="button" onClick={handleSubmit} disabled={isLoading}>
        {translations[language].search}
      </button>
      <br />
      {isLoading ? (
        <div className="loading-animation">
          {translations[language].loading}
        </div>
      ) : (
        <>
          {currentPasswords.length > 0 ? (
            <div>
              <h3>
                {translations[language].foundPasswords(
                  possiblePasswords.length
                )}
              </h3>
              <ul>
                {currentPasswords.map((password, index) => (
                  <li key={index} className="password">
                    {password}
                  </li>
                ))}
              </ul>
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
                  {translations[language].page(
                    currentPage,
                    Math.ceil(possiblePasswords.length / passwordsPerPage)
                  )}
                </p>
              </div>
            </div>
          ) : (
            <h3>{translations[language].noPasswords}</h3>
          )}
        </>
      )}
    </div>
  );
}

export default PasswordForm;
