module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '.*.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.smoke.ts',
    '!src/**/*.integration.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
  ],
  testMatch: ['**/src/**/*.test.ts'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        noUnusedParameters: false,
        noUnusedLocals: false
      }
    }
  },
  resetMocks: true,
  resetModules: true
};
