import re, locale
locale.setlocale(locale.LC_COLLATE, "pl_PL.UTF-8")

def get_polish_words(odm_text):
    words = set()
    lines = odm_text.strip().split("\n")
    for line in lines:
        word = line.split(",")[0].strip()
        if re.match(r"^[a-ząćęłńóśźż]+$", word):
            words.add(word)
    return words

# Wczytaj plik odm.txt
with open("odm.txt", "r", encoding="utf-8") as file:
    odm_text = file.read()

# Przetwórz tekst
polish_words = get_polish_words(odm_text)

# Posortuj alfabetycznie
polish_words = sorted(polish_words, key=locale.strxfrm)

# Zapisz wynik do nowego pliku
with open("public/slownik.txt", "w", encoding="utf-8", newline="\n") as file:
    file.write("\n".join(polish_words))
