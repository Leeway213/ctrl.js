/** @format */

const esModules = [].join('|');

module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  testRegex: '/src/.*\\.(T|t)est?\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
