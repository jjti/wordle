import WORDS from './words.json';

export default class WordleSolver {
  // words left to guess
  left: string[];

  // greens
  hits: string[] = [];

  // yellows from other boxes
  hints: { [char: string]: number }[];

  constructor(words: string[] = []) {
    this.left = words.length ? words : WORDS.slice();
    this.hints = new Array(5).fill(null).map(() => this.createEmptyCharFreqMap());
  }

  /* Create an empty char freq map */
  createEmptyCharFreqMap = () => 'abcdefghijklmnopqrstuvwxyz'.split('').reduce((acc, c) => ({ ...acc, [c]: 0.0 }), {});

  /**
   * Guess a word. Pick the one with highest summed letter frequencies at that location.
   */
  guess = (): string => {
    const charFreqMaps = new Array(5).fill(null).map((_, index) => {
      const charFreqMap = this.createEmptyCharFreqMap();
      this.left.forEach((word) => {
        charFreqMap[word[index]] += 1 + this.hints[index][word[index]];
      });
      return charFreqMap;
    });

    let guess: string;
    let guessScore: number = -1;
    this.left.forEach((word) => {
      const letterScores = word.split('').map((c, i) => charFreqMaps[i][c]);
      const score = letterScores.reduce((sum, v) => sum + v, 0);
      if (score > guessScore) {
        guess = word;
        guessScore = score;
      }
    });

    return guess;
  };

  /**
   * Update hits/hints/fails. Remove words.
   *
   * @param guessHits 5 length array of characters that are hits (green)
   * @param guessMisses 5 length array of characters that are misses (yellow)
   * @param guessFails 5 length array of characters that are fails (gray)
   */
  update = (guessHits: string[], guessMisses: string[], guessFails: string[]) => {
    guessFails.forEach((fail) => {
      this.left = this.left.filter((word) => !word.includes(fail));
    });

    guessMisses.forEach((miss, i) => {
      if (miss) {
        new Array(5).fill(null).forEach((_, j) => {
          if (i != j && !this.hits[i] && !guessHits[i]) {
            this.hints[j][miss] += 1;
          }
        });

        this.left = this.left.filter((word) => word[i] != miss);
      }
    });

    guessHits.forEach((hit, i) => {
      if (hit) {
        this.hits[i] = hit;
        this.hints.forEach((hint) => (hint[hit] = 0.0));

        this.left = this.left.filter((word) => word[i] == hit);
      }
    });
  };
}
