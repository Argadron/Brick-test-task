import { compilerOptions } from '../tsconfig.json'
import { pathsToModuleNameMapper } from 'ts-jest'

export default {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "./",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "moduleNameMapper": pathsToModuleNameMapper(compilerOptions.paths, { prefix: process.cwd() })
}