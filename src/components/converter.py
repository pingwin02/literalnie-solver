import re

def get_polish_words(odm_text):
    words = set()
    lines = odm_text.strip().split("\n")
    for line in lines:
        word = line.split(",")[0].strip()
        if re.match("^[a-z]+$", word):
            words.add(word)
    return words

# Wczytaj plik odm.txt
with open("odm.txt", "r", encoding="utf-8") as file:
    odm_text = file.read()

# Przetwórz tekst
polish_words = get_polish_words(odm_text)

# posortuj alfabetycznie
polish_words = sorted(polish_words)

# Zapisz wynik do nowego pliku
with open("slownik.txt", "w") as file:
    file.write("\n".join(polish_words))
