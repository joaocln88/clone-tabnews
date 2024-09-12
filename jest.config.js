//To bring .env.development variables to Jest
const dotenv = require('dotenv');
dotenv.config({ path: '.env.development' });
//

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: '.',
});
const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
});

module.exports = jestConfig;
