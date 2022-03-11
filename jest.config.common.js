module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@testUtil/(.*)$': '<rootDir>/testUtil/$1',
  },
  coverageDirectory: './coverage/',
};
