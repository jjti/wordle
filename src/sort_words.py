import json

order = {}
with open("./top_words.txt", "r") as f:
    for i, line in enumerate(f.readlines()):
        order[line.strip()] = i

with open("./words.json", "r") as words_f:
    words = json.load(words_f)

words.sort(key=lambda w: order.get(w, 10_000))

with open("./words.json", "w") as f:
    json.dump(words, f)
