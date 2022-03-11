// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.config.common');

module.exports = {
  ...defaultConfig,
  testMatch: ['**/__tests__/**/*.integration.test.[jt]s'],
};
