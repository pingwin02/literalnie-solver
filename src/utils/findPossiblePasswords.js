export const findPossiblePasswords = (
  inputString,
  bannedChars,
  yellowLetters,
  words,
  dictionaryMode
) => {
  const possiblePasswords = [];

  const minLetterCounts = {};
  const maxLetterCounts = {};
  const hardBannedLetters = new Set();

  if (!dictionaryMode) {
    for (let i = 0; i < inputString.length; i++) {
      const letter = inputString[i];
      if (letter !== "?") {
        minLetterCounts[letter] = (minLetterCounts[letter] || 0) + 1;
      }
    }

    if (yellowLetters) {
      for (let i = 0; i < yellowLetters.length; i++) {
        const yellowsAtPosition = yellowLetters[i];
        if (!yellowsAtPosition) continue;

        for (const yellowLetter of yellowsAtPosition) {
          minLetterCounts[yellowLetter] =
            (minLetterCounts[yellowLetter] || 0) + 1;
        }
      }
    }

    for (const bannedLetter of bannedChars) {
      if ((minLetterCounts[bannedLetter] || 0) > 0) {
        maxLetterCounts[bannedLetter] = minLetterCounts[bannedLetter];
      } else {
        maxLetterCounts[bannedLetter] = 0;
        hardBannedLetters.add(bannedLetter);
      }
    }
  }

  for (const word of words) {
    if (word.length === inputString.length || dictionaryMode) {
      let matches = true;

      for (let i = 0; i < inputString.length && matches; i++) {
        if (
          (inputString[i] !== "?" && inputString[i] !== word[i]) ||
          (!dictionaryMode &&
            inputString[i] === "?" &&
            hardBannedLetters.has(word[i]))
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

      if (matches && !dictionaryMode) {
        const letterCounts = {};
        for (const letter of word) {
          letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        for (const [letter, minCount] of Object.entries(minLetterCounts)) {
          if ((letterCounts[letter] || 0) < minCount) {
            matches = false;
            break;
          }
        }

        if (matches) {
          for (const [letter, maxCount] of Object.entries(maxLetterCounts)) {
            if ((letterCounts[letter] || 0) > maxCount) {
              matches = false;
              break;
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
