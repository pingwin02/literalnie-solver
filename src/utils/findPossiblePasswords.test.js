import { findPossiblePasswords } from "./findPossiblePasswords";

describe("findPossiblePasswords - English", () => {
  test("filters by fixed-position letters", () => {
    const words = ["cabin", "caper", "saber", "candy"];

    const result = findPossiblePasswords(
      "ca???",
      "",
      ["", "", "", "", ""],
      words,
      false
    );

    expect(result).toEqual(["cabin", "caper", "candy"]);
  });

  test("handles dictionary mode rules", () => {
    const words = ["cat", "cater", "catering", "dog"];

    const normalModeResult = findPossiblePasswords(
      "ca???",
      "",
      ["", "", "", "", ""],
      words,
      false
    );

    const dictionaryModeResult = findPossiblePasswords(
      "ca???",
      "xyz",
      ["a", "b", "c", "d", "e"],
      words,
      true
    );

    expect(normalModeResult).toEqual(["cater"]);
    expect(dictionaryModeResult).toEqual(["cat", "cater", "catering"]);
  });

  test("applies banned-letter constraints", () => {
    const words = ["cider", "caper", "sauce", "brace"];

    const result = findPossiblePasswords(
      "?????",
      "ce",
      ["", "", "", "", ""],
      words,
      false
    );

    expect(result).toEqual([]);
  });

  test("applies yellow-letter constraints", () => {
    const words = ["alert", "later", "stare", "taper"];

    const result = findPossiblePasswords(
      "?????",
      "",
      ["l", "", "", "", ""],
      words,
      false
    );

    expect(result).toEqual(["alert"]);
  });

  test("supports repeated-letter minimum count", () => {
    const words = ["banal", "canal", "karma", "caper"];

    const result = findPossiblePasswords(
      "?????",
      "",
      ["a", "", "a", "", ""],
      words,
      false
    );

    expect(result).toEqual(["banal", "canal", "karma"]);
  });

  test("applies maximum count for constrained letters", () => {
    const words = ["taker", "cabin", "karma", "banal"];

    const result = findPossiblePasswords(
      "?a???",
      "a",
      ["", "", "", "", ""],
      words,
      false
    );

    expect(result).toEqual(["taker", "cabin"]);
  });

  test("handles mixed constraints from multiple guesses", () => {
    const words = ["bluet", "gluer", "fluer", "value", "queue"];

    const result = findPossiblePasswords(
      "??ue?",
      "adios",
      ["", "", "l", "", ""],
      words,
      false
    );

    expect(result).toEqual(["bluet", "gluer", "fluer"]);
  });

  test("returns a single valid candidate when constraints are strict", () => {
    const words = ["fluke", "glide", "abuse", "floss", "indue"];

    const result = findPossiblePasswords(
      "??u?e",
      "adios",
      ["l", "", "", "e", "u"],
      words,
      false
    );

    expect(result).toEqual(["fluke"]);
  });
});

describe("findPossiblePasswords - Polish", () => {
  test("supports locale-specific characters", () => {
    const words = ["łośek", "łóżek", "łozek", "łukek"];

    const result = findPossiblePasswords(
      "ł?ż??",
      "",
      ["", "", "", "", ""],
      words,
      false
    );

    expect(result).toEqual(["łóżek"]);
  });

  test("handles repeated yellow-letter constraints", () => {
    const words = ["banan", "kajak", "alarm", "tatar", "czapa"];

    const result = findPossiblePasswords(
      "?????",
      "",
      ["a", "", "a", "", ""],
      words,
      false
    );

    expect(result).toEqual(["banan", "kajak", "tatar"]);
  });

  test("applies upper bounds for constrained letters", () => {
    const words = ["tanie", "kakao", "banan", "salto"];

    const result = findPossiblePasswords(
      "?a???",
      "a",
      ["", "", "", "", ""],
      words,
      false
    );

    expect(result).toEqual(["tanie", "salto"]);
  });
});
