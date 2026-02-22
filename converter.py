import re
import locale

locale.setlocale(locale.LC_COLLATE, "pl_PL.UTF-8")
print("✓ Locale set to pl_PL.UTF-8")


def get_polish_words(odm_text):
    words = set()
    lines = odm_text.strip().split("\n")
    for line in lines:
        word = line.split(",")[0].strip()
        if re.match(r"^[a-ząćęłńóśźż]+$", word):
            words.add(word)
    return words


print("\nReading odm.txt...")
with open("odm.txt", "r", encoding="utf-8") as file:
    odm_text = file.read()

polish_words = get_polish_words(odm_text)
print(f"✓ Found {len(polish_words)} Polish words")

print("Sorting Polish words...")
polish_words = sorted(polish_words, key=locale.strxfrm)

print("Writing to public/slownik.txt...")
with open("public/slownik.txt", "w", encoding="utf-8", newline="\n") as file:
    file.write("\n".join(polish_words))
print(f"✓ Wrote {len(polish_words)} words to public/slownik.txt")

print("\nReading words_alpha.txt...")
with open("./words_alpha.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

print("Cleaning lines...")
cleaned_lines = [line.replace("\r", "").strip() for line in lines]
print(f"✓ Cleaned {len(cleaned_lines)} words")

print("Writing to public/dictionary.txt...")
with open("public/dictionary.txt", "w", encoding="utf-8", newline="\n") as file:
    file.write("\n".join(cleaned_lines))
print(f"✓ Wrote {len(cleaned_lines)} words to public/dictionary.txt")

print("\n✓ Conversion completed successfully!")
