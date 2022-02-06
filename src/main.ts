import WORDS from './data/wordle.words.json';

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

  // Create an empty char freq map
  createEmptyCharFreqMap = (): { [char: string]: number } =>
    'abcdefghijklmnopqrstuvwxyz'.split('').reduce((acc, c) => ({ ...acc, [c]: 0.0 }), {});

  // Number of hits so far
  hitCount = () => this.hits.filter((c) => c).length;

  // Non-hit indicies
  nonHits = () => this.hits.reduce((acc, hit, i) => (hit ? acc : acc.concat(i)), []);

  // multiplied by this.left.length, is a penalty applied for duplicates
  duplicateCharPenaltyMultiplier = 1;

  constructor(words: string[] = []) {
    this.left = words.length ? words : [...WORDS];
  }

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

    const nonHits = this.nonHits();
    const duplicatePenalty = (word: string) => {
      return (
        (5 - (new Set(nonHits.map((i) => word[i])).size + this.hits.length)) *
        this.duplicateCharPenaltyMultiplier *
        this.left.length
      );
    };

    const rarityPenalty = (i: number) => {
      return this.guesses * (this.left.length * (i / this.left.length));
    };

    let guess: string;
    let guessScore = Number.MIN_SAFE_INTEGER;
    this.left.forEach((word, i) => {
      const score = word.split('').reduce((acc, c, i) => acc + charFreqMaps[i][c], 0) - duplicatePenalty(word) - rarityPenalty(i);

      if (score > guessScore) {
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
    const resultChars = result.split('');

    resultChars.forEach((c, i) => {
      const char = guess[i];
      if (c === 'h') {
        // this character was a hit (green)
        this.hits[i] = char;
        this.left = this.left.filter((word) => word[i] == char);
      }
    });

    const nonHits = this.nonHits();
    resultChars.forEach((c, i) => {
      const char = guess[i];
      if (c === 'm') {
        // this character was a miss (yellow)
        this.left = this.left.filter((word) => word[i] != char);
        this.left = this.left.filter((word) => nonHits.findIndex((j) => word[j] == char) >= 0);
      } else if (c === 'f') {
        // this character was a fail
        if (resultChars.filter((z, j) => z === 'm' && guess[j] == char).length) {
          return; // there was a miss with this character though
        }
        this.left = this.left.filter((word) => nonHits.findIndex((j) => word[j] === char) < 0);
      }
    });
  };

  /**
   * Stick the guess in the header.
   *
   * @param guess to update header to
   */
  setTitle = (guess: string) => {
    document.getElementsByTagName('game-app')[0].shadowRoot.children[1].getElementsByClassName('title')[0].textContent = guess;
    console.log(`guess ${this.guesses}: ${guess}; words left: ${this.left.length}`);
  };

  /**
   * Get the row currently being guessed.
   */
  getActiveRow = () => {
    const rows = document.getElementsByTagName('game-app')[0].shadowRoot.children[1].getElementsByTagName('game-row');
    return rows[this.guesses - 1];
  };

  /**
   * Return the result of last guess.
   */
  getResult = () => {
    const activeRow = this.getActiveRow();
    if (!activeRow || !activeRow.getAttribute('letters') || activeRow.getAttribute('letters').length !== 5) {
      return [null, null];
    }
    const guess = activeRow.getAttribute('letters');

    let result = '';
    for (const box of this.getActiveRow().shadowRoot.children[1].children) {
      const evaluation = box.getAttribute('evaluation');
      if (!evaluation || !evaluation.length) {
        return [null, null];
      }

      if (evaluation === 'absent') {
        result += 'f';
      } else if (evaluation === 'present') {
        result += 'm';
      } else {
        result += 'h';
      }
    }

    console.log(`actual-guess: ${guess}; result: ${result}`);
    return [guess, result];
  };
}

/**
 * Make a guess, update DOM, wait, do it again.
 */
function makeGuess(solver: WordleSolver, updateTitle = true) {
  if (updateTitle) {
    solver.setTitle(solver.guess());
  }

  const [guess, result] = solver.getResult();
  if (!guess || !result) {
    setTimeout(() => makeGuess(solver, false), 100);
    return;
  }

  solver.update(guess, result);
  makeGuess(solver);
}

if (typeof window !== 'undefined') {
  makeGuess(new WordleSolver());
}
