export const findPossiblePasswords = (
  inputString,
  bannedChars,
  mustContain,
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
      if (
        matches &&
        (mustContain === "" ||
          dictionaryMode ||
          mustContain.split("").every((char) => {
            const regex = new RegExp(char, "g");
            const matches = (word.match(regex) || []).length;
            const mustContainMatches = (mustContain.match(regex) || []).length;
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
