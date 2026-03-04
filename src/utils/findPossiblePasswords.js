export const findPossiblePasswords = ({
  guesses,
  words,
  dictionaryMode,
  inputString = ""
}) => {
  if (dictionaryMode) {
    return words.filter((word) =>
      word.toLowerCase().startsWith(inputString.toLowerCase())
    );
  }

  const passwordLength = guesses?.[0]?.length || 5;
  const fixedLetters = Array(passwordLength).fill(null);
  const notAtPosition = Array.from({ length: passwordLength }, () => new Set());
  const minLetterCounts = {};
  const maxLetterCounts = {};

  for (const guess of guesses || []) {
    const rowPresentCounts = {};
    const rowGrayCounts = {};

    for (let index = 0; index < guess.length; index++) {
      const cell = guess[index];
      const letter = (cell.letter || "").toLowerCase();
      if (!letter) continue;

      if (cell.color === "green") {
        fixedLetters[index] = letter;
        rowPresentCounts[letter] = (rowPresentCounts[letter] || 0) + 1;
      } else if (cell.color === "yellow") {
        notAtPosition[index].add(letter);
        rowPresentCounts[letter] = (rowPresentCounts[letter] || 0) + 1;
      } else {
        rowGrayCounts[letter] = (rowGrayCounts[letter] || 0) + 1;
      }
    }

    const rowLetters = new Set([
      ...Object.keys(rowPresentCounts),
      ...Object.keys(rowGrayCounts)
    ]);

    for (const letter of rowLetters) {
      const presentCount = rowPresentCounts[letter] || 0;
      const hasGray = (rowGrayCounts[letter] || 0) > 0;

      minLetterCounts[letter] = Math.max(
        minLetterCounts[letter] || 0,
        presentCount
      );

      if (hasGray) {
        const existingMax = maxLetterCounts[letter];
        maxLetterCounts[letter] =
          existingMax === undefined
            ? presentCount
            : Math.min(existingMax, presentCount);
      }
    }
  }

  return words.filter((word) => {
    if (word.length !== passwordLength) {
      return false;
    }

    for (let index = 0; index < passwordLength; index++) {
      const fixedLetter = fixedLetters[index];
      if (fixedLetter && word[index] !== fixedLetter) {
        return false;
      }

      if (notAtPosition[index].has(word[index])) {
        return false;
      }
    }

    const letterCounts = {};
    for (const letter of word) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    for (const [letter, minCount] of Object.entries(minLetterCounts)) {
      if ((letterCounts[letter] || 0) < minCount) {
        return false;
      }
    }

    for (const [letter, maxCount] of Object.entries(maxLetterCounts)) {
      if ((letterCounts[letter] || 0) > maxCount) {
        return false;
      }
    }

    return true;
  });
};
