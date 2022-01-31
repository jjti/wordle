import WordleSolver from './main';

describe('WordleSolver', () => {
  it('creates empty char freq maps', () => {
    const charFreqMap = new WordleSolver(['aback']).createEmptyCharFreqMap();
    expect(Object.values(charFreqMap)).toEqual(new Array(26).fill(0));
    expect(charFreqMap['a']).toEqual(0);
    expect(charFreqMap['z']).toEqual(0);
  });

  it('guesses', () => {
    const solver = new WordleSolver(['aback', 'abask', 'flask']);

    expect(solver.guess()).toEqual('abask');
  });

  it('updates fails', () => {
    const solver = new WordleSolver(['aback', 'abask', 'flask']);
    expect(solver.left).toContain('aback');

    solver.update([], [], ['a', 'b', 'a', 'c', 'k']);

    ['aback', 'abask', 'flask'].forEach((word) => expect(solver.left).not.toContain(word));
  });

  it('updates hints', () => {
    const solver = new WordleSolver(['aback']);
    expect(solver.hints[1]['a']).toEqual(0);
    expect(solver.hints[2]['a']).toEqual(0);

    solver.update([], [null, null, 'a', null, null], []);

    expect(solver.hints[1]['a']).toEqual(1);
    expect(solver.hints[2]['a']).toEqual(0);

    solver.update([null, 'a', null, null, null], [null, null, null, null, null], []);

    expect(solver.hints[1]['a']).toEqual(0);
    expect(solver.hints[2]['a']).toEqual(0);
  });

  it('updates hits', () => {
    const solver = new WordleSolver(['aback', 'backs', 'hacks']);

    solver.update([null, null, null, 'k', 's'], [], []);

    expect(solver.left).not.toContain('aback');
    expect(solver.left).toContain('backs');
    expect(solver.left).toContain('hacks');
  });
});
