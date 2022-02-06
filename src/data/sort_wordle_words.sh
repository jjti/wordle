#!/bin/bash

raw="wiktionary.words.raw"
rm -f $raw
for i in {0..9}; do
    start=$(( $i * 10000 + 1 ))
    end=$(( $i * 10000 + 10000 ))
    base="https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2005/08"
    url="$base/$start-$end"
    echo "Getting: $url"
    curl $url >> $raw
done

words="wiktionary.words.parsed"
cat $raw | grep -Eo 'title=\"[a-z]{5}\"' | cut -d\" -f2 > $words

./sort_words.py
