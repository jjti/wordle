import * as seedrandom from 'seedrandom';
import WordleSolver from './main';
import * as WORDS from './words.json';

/**
 * Return the number of guesses required to answer the question.
 *
 * @param answer we're benchmarking
 */
const solve = (answer: string): number => {
  const solver = new WordleSolver();
  const charFreqMap = solver.createEmptyCharFreqMap();
  answer.split('').forEach((c) => (charFreqMap[c] += 1));

  const history = [];
  for (let i = 0; i < 20; i++) {
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
            .filter((z) => z === c).length === charFreqMap[c]
        ) {
          return 'f'; // it's a miss but already told user (w/ yellow)
        } else {
          return 'm';
        }
      })
      .join('');
    history.push(`answer: ${answer}, guess: ${guess}, result: ${result}`);
    solver.update(guess, result);
  }
  console.warn(history);
  throw Error('never solved it');
};

describe('Benchmarks', () => {
  it('can solve', () => {
    expect(solve('wrung')).toBeLessThan(10);
  });

  it('current benchmark value', () => {
    const random = seedrandom('42');

    const summedGuessesRequired = new Array(100)
      .fill(null)
      .map(() => WORDS[Math.round(WORDS.length * random.double())])
      .map(solve)
      .reduce((acc, v) => acc + v, 0);

    expect(summedGuessesRequired).toBeLessThan(5);
  });
});
