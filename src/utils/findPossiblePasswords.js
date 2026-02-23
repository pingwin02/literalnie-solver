export const findPossiblePasswords = (
  inputString,
  bannedChars,
  yellowLetters,
  words,
  dictionaryMode
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

      if (matches && !dictionaryMode && yellowLetters) {
        for (let i = 0; i < yellowLetters.length && matches; i++) {
          const yellowsAtPosition = yellowLetters[i];
          if (yellowsAtPosition !== "") {
            for (const yellowLetter of yellowsAtPosition) {
              if (word[i] === yellowLetter) {
                matches = false;
                break;
              }
              if (!word.includes(yellowLetter)) {
                matches = false;
                break;
              }
            }
          }
        }
      }

      if (matches) {
        possiblePasswords.push(word);
      }
    }
  }

  return possiblePasswords;
};
