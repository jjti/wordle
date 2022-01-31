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

    expect(solver.guess()).toEqual('flask');
  });

  it('updates hits', () => {
    const solver = new WordleSolver(['aback', 'backs', 'hacks']); // answer: hacks

    solver.update('backs', 'fhhhh');

    expect(solver.left).not.toContain('aback');
    expect(solver.left).not.toContain('backs');
    expect(solver.left).toContain('hacks');
    expect(solver.hits).toEqual([null, 'a', 'c', 'k', 's']);
  });

  it('updates misses', () => {
    const solver = new WordleSolver(['zazzz']); // answer: zazzz

    solver.update('bbabb', 'ffmff');
    expect(new Array(5).fill(null).map((_, i) => solver.hints[i]['a'])).toEqual([1, 1, 0, 1, 1]);

    solver.update('bzbbb', 'fmfff');
    expect(new Array(5).fill(null).map((_, i) => solver.hints[i]['z'])).toEqual([1, 0, 1, 1, 1]);

    solver.update('zbbbb', 'hffff');
    expect(new Array(5).fill(null).map((_, i) => solver.hints[i]['z'])).toEqual([0, 0, 0, 0, 0]);
  });

  it('updates fails', () => {
    const solver = new WordleSolver(['aback', 'abask', 'flask', 'utfel']);
    expect(solver.left).toContain('aback');

    solver.update('aback', 'fffff');

    ['aback', 'abask', 'flask'].forEach((word) => expect(solver.left).not.toContain(word));
    expect(solver.left).toContain('utfel');
  });
});
