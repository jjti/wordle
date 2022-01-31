import { question } from 'readline-sync';
import * as WORDS from './words.json';

/**
 * A really stupid wordle solver.
 */
export default class WordleSolver {
  // number of guesses used so far
  guesses = 0;

  // words left to guess
  left: string[];

  // greens
  hits: string[] = new Array(5).fill(null);

  // yellows from other boxes
  hints: { [char: string]: number }[];

  constructor(words: string[] = []) {
    this.left = words.length ? words : [...WORDS];
    this.hints = new Array(5).fill(null).map(() => this.createEmptyCharFreqMap());
  }

  /* Create an empty char freq map */
  createEmptyCharFreqMap = (): { [char: string]: number } =>
    'abcdefghijklmnopqrstuvwxyz'.split('').reduce((acc, c) => ({ ...acc, [c]: 0.0 }), {});

  /* Number of hits so far */
  hitCount = () => this.hits.filter((c) => c).length;

  /**
   * Guess a word. Pick the one with highest summed letter frequencies at that location.
   */
  guess = (): string => {
    const charFreqMaps = new Array(5).fill(null).map((_, i) => {
      const charFreqMap = this.createEmptyCharFreqMap();
      this.left.forEach((word) => {
        charFreqMap[word[i]] += 1;
      });
      return charFreqMap;
    });

    const hintBump = this.left.length / (5 - this.hitCount());
    let guess: string;
    let guessScore = -1;
    this.left.forEach((word) => {
      const letterScores = word.split('').map((c, i) => charFreqMaps[i][c] + this.hints[i][c] * hintBump);
      const score = letterScores.reduce((acc, v) => acc + v, 0);
      if (score > guessScore) {
        if (this.guesses < 2 && this.hitCount() == 0 && new Set(word).size < 5) {
          return; // try to spread out letters in early guesses
        }
        guess = word;
        guessScore = score;
      }
    });

    this.guesses += 1;
    return guess;
  };

  /**
   * Update hits/hints/fails. Remove words.
   *
   * @param guess previous
   * @param result h:hit, m:miss, f:fail
   */
  update = (guess: string, result: string) => {
    result = result.toLowerCase();
    result.split('').forEach((c, i) => {
      const char = guess[i];
      if (c === 'h') {
        // this character was a hit (green)
        this.hits[i] = char;
        this.hints.forEach((hint) => (hint[char] = 0.0));
        this.left = this.left.filter((word) => word[i] == char);
      } else if (c === 'm') {
        // this character was a miss (yellow)
        this.hints[i][char] = 0;
        new Array(5).fill(null).forEach((_, j) => {
          if (i != j) {
            this.hints[j][char] = 1;
          }
        });
        this.left = this.left.filter((word) => word[i] != char);
      } else {
        // this character was a fail
        if (
          result
            .substring(0, i)
            .split('')
            .filter((z, i) => z === 'm' && guess[i] == char).length
        ) {
          return; // there was a hit/miss with this character though
        }
        this.hints.forEach((hint) => (hint[char] = 0.0));
        this.left = this.left.filter((word) => !word.substring(i).includes(char));
      }
    });
  };
}

/* Temp CLI for debugging/testing */
if (require.main === module) {
  console.log('h: hit; m: miss; f: fail');

  const solver = new WordleSolver();
  new Array(6).fill(null).forEach(() => {
    const guess = solver.guess();
    if (!guess) throw Error('No words left!');
    console.log(`guess: ${guess}`);
    solver.update(guess, question('result: '));
  });
}
