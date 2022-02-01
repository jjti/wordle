import * as seedrandom from 'seedrandom';
import WordleSolver from './main';
import * as WORDS from './words.json';

/**
 * Return the number of guesses required to answer the question.
 *
 * @param answer we're benchmarking
 */
export const solve = (solver: WordleSolver, answer: string): number => {
  const charFreqMap = solver.createEmptyCharFreqMap();
  answer.split('').forEach((c) => (charFreqMap[c] += 1));

  const history = [];
  for (let i = 0; i < 10; i++) {
    const guess = solver.guess();
    if (!guess) {
      console.error(solver.left.length);
      console.warn(history);
      throw Error('Ran out of words');
    }
    if (guess === answer) {
      return solver.guesses;
    }

    const result = guess
      .split('')
      .map((c, i) => {
        if (c == answer[i]) {
          return 'h';
        } else if (!answer.includes(c)) {
          return 'f';
        } else if (
          guess
            .substring(0, i)
            .split('')
            .filter((_, j) => j != i)
            .filter((z) => z === c).length === charFreqMap[c]
        ) {
          return 'f'; // it's a miss but already told user (w/ yellow/green)
        } else {
          return 'm';
        }
      })
      .join('');
    history.push(`answer: ${answer}, guess: ${guess}, result: ${result}`);
    solver.update(guess, result);
  }
  return 10;
};

describe('Benchmarks', () => {
  test.only('can solve', () => {
    expect(solve(new WordleSolver(), 'wrung')).toBeLessThan(10);
  });

  // low score = 979 with 2, 2, 3
  test('tunes', () => {
    const random = seedrandom('42');
    const samples = new Array(200).fill(null).map(() => WORDS[Math.round(WORDS.length * random.double())]);

    const hintBumpMultiplier = [2];
    const hintBumpLeftMultiplier = [2];
    const duplicateCharPenaltyMultiplier = [3];

    const results = [];
    hintBumpMultiplier.forEach((hbm) => {
      hintBumpLeftMultiplier.forEach((blm) => {
        duplicateCharPenaltyMultiplier.forEach((cpm) => {
          const guesses = samples.map((word) => {
            const solver = new WordleSolver();
            solver.hintBumpMultiplier = hbm;
            solver.hintBumpLeftMultiplier = blm;
            solver.duplicateCharPenaltyMultiplier = cpm;
            return solve(solver, word);
          });

          const total = guesses.reduce((acc, g) => acc + g, 0);
          results.push([total, hbm, blm, cpm]);
        });
      });
    });

    results.sort();
    results.forEach((r) => {
      console.warn(r);
    });
  });
});
