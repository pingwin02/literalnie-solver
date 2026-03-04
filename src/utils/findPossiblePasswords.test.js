import { findPossiblePasswords } from "./findPossiblePasswords";

describe("findPossiblePasswords - English", () => {
  const createGuess = (letters, colors) =>
    letters.split("").map((letter, index) => ({
      letter,
      color: colors[index]
    }));

  test("filters by fixed-position letters", () => {
    const words = ["cabin", "caper", "saber", "candy"];

    const guesses = [
      createGuess("caaaa", ["green", "green", "gray", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["cabin", "caper", "candy"]);
  });

  test("handles dictionary mode rules", () => {
    const words = ["cat", "cater", "catering", "dog"];

    const normalModeResult = findPossiblePasswords({
      guesses: [],
      words,
      dictionaryMode: false
    });

    const dictionaryModeResult = findPossiblePasswords({
      guesses: [],
      words,
      dictionaryMode: true,
      inputString: "cat"
    });

    expect(normalModeResult).toEqual(["cater"]);
    expect(dictionaryModeResult).toEqual(["cat", "cater", "catering"]);
  });

  test("applies yellow-letter constraints", () => {
    const words = ["alert", "later", "stare", "taper", "aback"];
    const guesses = [
      createGuess("lzzzz", ["yellow", "gray", "gray", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["alert"]);
  });

  test("supports repeated-letter minimum from one row", () => {
    const words = ["banal", "canal", "karma", "caper", "alarm"];
    const guesses = [
      createGuess("axxxa", ["yellow", "gray", "gray", "gray", "yellow"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["banal", "canal"]);
  });

  test("applies maximum count when repeated guess has gray", () => {
    const words = ["entry", "eager", "level", "creed"];
    const guesses = [
      createGuess("eezzz", ["green", "gray", "gray", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["entry"]);
  });

  test("does not overcount yellow letter across different rows", () => {
    const words = ["xerox", "crept", "vexed", "eerie"];
    const guesses = [
      createGuess("adieu", ["gray", "gray", "gray", "yellow", "gray"]),
      createGuess("eagle", ["yellow", "gray", "gray", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["xerox", "crept"]);
  });
});

describe("findPossiblePasswords - Polish", () => {
  const createGuess = (letters, colors) =>
    letters.split("").map((letter, index) => ({
      letter,
      color: colors[index]
    }));

  test("supports locale-specific characters", () => {
    const words = ["łośek", "łóżek", "łozek", "łukek"];
    const guesses = [
      createGuess("łżzzz", ["green", "yellow", "gray", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["łóżek"]);
  });

  test("handles repeated yellow-letter constraints in one row", () => {
    const words = ["banan", "kajak", "alarm", "tatar", "czapa", "karta"];
    const guesses = [
      createGuess("axaxx", ["yellow", "gray", "yellow", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["banan", "kajak", "tatar", "karta"]);
  });

  test("applies upper bounds from gray+yellow mix", () => {
    const words = ["tanie", "kakao", "banan", "salto", "alarm"];
    const guesses = [
      createGuess("aaxxx", ["yellow", "gray", "gray", "gray", "gray"])
    ];

    const result = findPossiblePasswords({
      guesses,
      words,
      dictionaryMode: false
    });

    expect(result).toEqual(["tanie", "salto"]);
  });
});
