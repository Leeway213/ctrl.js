/**
 * @format
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import pkg from '../../package.json';

const CJS = !!process.env.CJS;
const ES = !!process.env.ES;
const IIFE = !!process.env.IIFE;
const PROD = !!process.env.PRODUCTION;

export default function () {
  return [
    CJS && {
      file: pkg.main,
      format: 'cjs',
      sourcemap: !PROD,
    },
    ES && {
      file: pkg.module,
      format: 'es',
      sourcemap: !PROD,
    },
    IIFE && {
      file: pkg.browser,
      format: 'iife',
      name: pkg.name.toUpperCase().replace(/-/g, '_'),
      sourcemap: !PROD,

      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {},
    },
  ];
}
