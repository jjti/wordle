// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/main.ts',
  output: {
    dir: './dist',
    format: 'umd',
    name: 'wordle-solver',
  },
  plugins: [typescript(), json()],
};
