const translations = {
  pl: {
    enterPassword: "Podaj hasło:",
    bannedChars: "Podaj litery do zbanowania:",
    mustContain: "Podaj litery, które muszą się znaleźć w haśle:",
    dictionaryMode: "Tryb słownikowy:",
    search: "Szukaj",
    loading: "Ładowanie...",
    foundPasswords: (count) => `Znalazłem ${count} możliwych haseł:`,
    noPasswords: "Brak możliwych haseł dla podanych ograniczeń.",
    page: (current, total) => `Strona ${current} z ${total}`,
    languageToggle: "Język:",
    homePage: {
      title: "Literalnie Solver",
      description: "Aplikacja do rozwiązywania zagadek z gry Literalnie.",
      showInstructions: "Pokaż instrukcję",
      hideInstructions: "Schowaj instrukcję",
      instructions: [
        "Wpisz hasło, które chcesz rozwiązać, w polu Podaj hasło. Jeśli nie znasz litery zostaw pole puste. Możesz również wybrać tryb słownikowy, wtedy długość hasła nie ma znaczenia. Przykład: ???os",
        "Wpisz litery, które chcesz zbanować, w polu Podaj litery do zbanowania. Jeśli nie chcesz zbanować żadnej litery, pozostaw to pole puste. Przykład: o",
        "Wpisz litery, które muszą się znaleźć w haśle, w polu Podaj litery, które muszą się znaleźć w haśle. Jeśli nie musi się znaleźć żadna litera, pozostaw to pole puste. Przykład: s",
        "Kliknij przycisk Szukaj."
      ],
      scrollTop: "Do góry"
    }
  },
  en: {
    enterPassword: "Enter password:",
    bannedChars: "Enter letters to ban:",
    mustContain: "Enter letters that must be in the password:",
    dictionaryMode: "Dictionary mode:",
    search: "Search",
    loading: "Loading...",
    foundPasswords: (count) => `Found ${count} possible passwords:`,
    noPasswords: "No possible passwords for the given constraints.",
    page: (current, total) => `Page ${current} of ${total}`,
    languageToggle: "Language:",
    homePage: {
      title: "Literalnie Solver",
      description:
        "An application for solving puzzles from the game Literalnie.",
      showInstructions: "Show instructions",
      hideInstructions: "Hide instructions",
      instructions: [
        "Enter the password you want to solve in the Enter password field. If you don't know a letter, leave the field empty. You can also select dictionary mode, where the length of the password doesn't matter. Example: ???os",
        "Enter the letters you want to ban in the Enter letters to ban field. If you don't want to ban any letters, leave this field empty. Example: o",
        "Enter the letters that must be in the password in the Enter letters that must be in the password field. If no letters are required, leave this field empty. Example: s",
        "Click the Search button."
      ],
      scrollTop: "Scroll to top"
    }
  }
};

export default translations;
