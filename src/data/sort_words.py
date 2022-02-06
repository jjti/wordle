#!/usr/bin/python3

import json

order = {}
with open("wiktionary.words.parsed", "r") as f:
    for i, line in enumerate(f.readlines()):
        order.setdefault(line.strip(), i)

assert order.get("which") == 0, order.get("which")

with open("wordle.words.json", "r") as words_f:
    words = json.load(words_f)

words = sorted(words, key=lambda w: order.get(w, 20_000))

with open("wordle.words.json", "w") as f:
    json.dump(words, f)
