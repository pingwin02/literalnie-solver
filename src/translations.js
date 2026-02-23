const translations = {
  pl: {
    enterPassword: "Podaj hasło:",
    bannedChars: "Podaj litery do zbanowania:",
    mustContain:
      "Podaj litery, które są w haśle, ale nie w tym miejscu (żółte):",
    dictionaryMode: "Tryb słownikowy:",
    dictionaryModeNotice: "Tryb słownikowy wyłączony - użyj siatki poniżej",
    conflictDetected:
      "Konflikt! Ta sama kolumna ma różne zielone litery w różnych wierszach.",
    loading: "Ładowanie...",
    foundPasswords: (count) => `Znalazłem ${count} możliwych haseł:`,
    foundOnePassword: (password) => `Znaleziono hasło: ${password}`,
    noPasswords: "Brak możliwych haseł dla podanych ograniczeń.",
    page: (current, total) => `Strona ${current} z ${total}`,
    languageToggle: "Język:",
    homePage: {
      title: "Literalnie Solver",
      description: (
        <>
          Aplikacja do rozwiązywania zagadek z gry{" "}
          <a
            href="https://literalnie.fun/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Literalnie
          </a>
          .
        </>
      ),
      showInstructions: "Pokaż instrukcję",
      hideInstructions: "Schowaj instrukcję",
      instructions: [
        <>
          Wpisz litery w kratkach. Możesz{" "}
          <strong>edytować wszystkie wypełnione wiersze</strong>.
        </>,
        <>
          Kliknij na kratkę z literą, aby zmienić jej kolor:{" "}
          <span style={{ color: "#787c7e", fontWeight: "bold" }}>szary</span>{" "}
          (litera nie występuje w haśle),{" "}
          <span style={{ color: "#c9b458", fontWeight: "bold" }}>żółty</span>{" "}
          (litera jest w haśle ale w złej pozycji),{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>zielony</span>{" "}
          (litera jest w haśle na właściwej pozycji).
        </>,
        <>
          Jeśli w kolumnie jest już{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>
            zielona litera
          </span>
          , pojawi się jako <strong>podpowiedź</strong> (słabo widoczna) w
          aktualnym wierszu. Naciśnij <strong>Tab</strong>,{" "}
          <strong>spację</strong> lub <strong>kliknij</strong> aby ją uzupełnić.
        </>,
        <>
          Następny wiersz odblokuje się automatycznie po wypełnieniu wszystkich{" "}
          <strong>5 kratek</strong> w bieżącym wierszu. Jeśli wszystkie 5 liter
          jest{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>
            zielonych
          </span>
          , dalsze wiersze zostaną <strong>zablokowane</strong>.
        </>,
        <>
          Wyniki wyszukiwania pojawiają się <strong>automatycznie</strong> na
          podstawie wprowadzonych informacji.
        </>
      ],
      instructionsMobile: [
        <>
          Wpisz litery w kratkach. Możesz{" "}
          <strong>edytować wszystkie wypełnione wiersze</strong>.
        </>,
        <>
          Kliknij na kratkę z literą, aby zmienić jej kolor:{" "}
          <span style={{ color: "#787c7e", fontWeight: "bold" }}>szary</span>{" "}
          (litera nie występuje w haśle),{" "}
          <span style={{ color: "#c9b458", fontWeight: "bold" }}>żółty</span>{" "}
          (litera jest w haśle ale w złej pozycji),{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>zielony</span>{" "}
          (litera jest w haśle na właściwej pozycji).
        </>,
        <>
          Jeśli w kolumnie jest już{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>
            zielona litera
          </span>
          , pojawi się jako <strong>podpowiedź</strong> (słabo widoczna) w
          aktualnym wierszu. <strong>Kliknij</strong> aby ją uzupełnić.
        </>,
        <>
          Następny wiersz odblokuje się automatycznie po wypełnieniu wszystkich{" "}
          <strong>5 kratek</strong> w bieżącym wierszu. Jeśli wszystkie 5 liter
          jest{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>
            zielonych
          </span>
          , dalsze wiersze zostaną <strong>zablokowane</strong>.
        </>,
        <>
          Wyniki wyszukiwania pojawiają się <strong>automatycznie</strong> na
          podstawie wprowadzonych informacji.
        </>
      ],
      scrollTop: "Do góry",
      scrollBottom: "Na dół"
    }
  },
  en: {
    enterPassword: "Enter password:",
    bannedChars: "Enter letters to ban:",
    mustContain:
      "Enter letters that are in the password but not in this position (yellow):",
    dictionaryMode: "Dictionary mode:",
    dictionaryModeNotice: "Dictionary mode disabled - use the grid below",
    conflictDetected:
      "Conflict! The same column has different green letters in different rows.",
    loading: "Loading...",
    foundPasswords: (count) => `Found ${count} possible passwords:`,
    foundOnePassword: (password) => `Password found: ${password}`,
    noPasswords: "No possible passwords for the given constraints.",
    page: (current, total) => `Page ${current} of ${total}`,
    languageToggle: "Language:",
    homePage: {
      title: "Wordle Solver",
      description: (
        <>
          An application for solving puzzles from the game{" "}
          <a
            href="https://www.nytimes.com/games/wordle/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wordle
          </a>
          .
        </>
      ),
      showInstructions: "Show instructions",
      hideInstructions: "Hide instructions",
      instructions: [
        <>
          Type letters in the cells. You can{" "}
          <strong>edit all filled rows</strong>.
        </>,
        <>
          Click on a cell with a letter to change its color:{" "}
          <span style={{ color: "#787c7e", fontWeight: "bold" }}>gray</span>{" "}
          (letter not in word),{" "}
          <span style={{ color: "#c9b458", fontWeight: "bold" }}>yellow</span>{" "}
          (letter in word but wrong position),{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>green</span>{" "}
          (letter in word at correct position).
        </>,
        <>
          If a column already has a{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>
            green letter
          </span>
          , it will appear as a <strong>hint</strong> (faded) in the current
          row. Press <strong>Tab</strong>, <strong>Space</strong> or{" "}
          <strong>click</strong> to fill it in.
        </>,
        <>
          The next row unlocks automatically after filling all{" "}
          <strong>5 cells</strong> in the current row. If all 5 letters are{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>green</span>,
          further rows will be <strong>blocked</strong>.
        </>,
        <>
          Search results appear <strong>automatically</strong> based on the
          information you enter.
        </>
      ],
      instructionsMobile: [
        <>
          Type letters in the cells. You can{" "}
          <strong>edit all filled rows</strong>.
        </>,
        <>
          Click on a cell with a letter to change its color:{" "}
          <span style={{ color: "#787c7e", fontWeight: "bold" }}>gray</span>{" "}
          (letter not in word),{" "}
          <span style={{ color: "#c9b458", fontWeight: "bold" }}>yellow</span>{" "}
          (letter in word but wrong position),{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>green</span>{" "}
          (letter in word at correct position).
        </>,
        <>
          If a column already has a{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>
            green letter
          </span>
          , it will appear as a <strong>hint</strong> (faded) in the current
          row. <strong>Click</strong> to fill it in.
        </>,
        <>
          The next row unlocks automatically after filling all{" "}
          <strong>5 cells</strong> in the current row. If all 5 letters are{" "}
          <span style={{ color: "#6aaa64", fontWeight: "bold" }}>green</span>,
          further rows will be <strong>blocked</strong>.
        </>,
        <>
          Search results appear <strong>automatically</strong> based on the
          information you enter.
        </>
      ],
      scrollTop: "Scroll to top",
      scrollBottom: "Scroll to bottom"
    }
  }
};

export default translations;
