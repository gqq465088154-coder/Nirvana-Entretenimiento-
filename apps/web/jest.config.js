/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  moduleNameMapper: {
    '\\.module\\.css$': '<rootDir>/__tests__/__mocks__/styleMock.js',
    '\\.css$': '<rootDir>/__tests__/__mocks__/styleMock.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  transformIgnorePatterns: ['/node_modules/']
};

module.exports = config;
