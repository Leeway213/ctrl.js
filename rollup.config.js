/**
 * @format
 */

/* eslint-disable @typescript-eslint/camelcase */

import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import json from '@rollup/plugin-json';
import glslify from 'rollup-plugin-glslify';
import pkg from './package.json';
import serveBuilder from './build/rollup/serve';
import outputBuilder from './build/rollup/output';

const production = !!process.env.PRODUCTION;
const serving = !!process.env.SERVE;

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  watch: {
    include: ['src/**'],
    exclude: ['node_modules/**'],
  },

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    glslify({
      include: ['**/*.vs', '**/*.fs', '**/*.vert', '**/*.frag', '**/*.glsl'],
      exclude: 'node_modules/**',
      compress: true,
    }),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'] }),

    sourcemaps(),

    json(),

    production &&
      terser({
        compress: {
          pure_funcs: ['console.log', 'console.debug'],
        },
      }),

    !serving &&
      generatePackageJson({
        outputFolder: 'dist',
        baseContents: () => ({
          ...pkg,
          scripts: {},
          devDependencies: {},
          main: pkg.main.replace('dist/', ''),
          module: pkg.module.replace('dist/', ''),
          browser: pkg.browser.replace('dist/', ''),
          types: pkg.types.replace('dist/', ''),
        }),
      }),

    ...serveBuilder(serving),
  ],

  output: [...outputBuilder()],
};
