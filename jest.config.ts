/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  //  verbose: true,
  setupFilesAfterEnv: ["jest-extended/all"],
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["index.ts", "express-flash-plus.d.ts"],

  globals: {},
  transform: {
    '^.+\\.ts?$': ['ts-jest', 
    { diagnostics: true,
      tsconfig: './tsconfig.json',
      isolatedModules: true // tests roulent plus rapidement
    }],
  },
};
export default config;
