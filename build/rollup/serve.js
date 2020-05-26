/**
 * @format
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

export default function (serving) {
  if (serving) {
    // import serve from 'rollup-plugin-serve';
    // import livereload from 'rollup-plugin-livereload';
    const serve = require('rollup-plugin-serve');
    const livereload = require('rollup-plugin-livereload');
    return [
      serve({
        contentBase: ['dist', 'playground'],
        port: 1024,
      }),
      livereload(),
    ];
  } else {
    return [];
  }
}

// export default [
//   serve({
//     contentBase: ['dist', 'playground'],
//     port: 1024,
//   }),
//   livereload()
// ];
