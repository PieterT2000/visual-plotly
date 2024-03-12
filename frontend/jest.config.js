export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    // process `*.tsx` files with `ts-jest`
  },
  rootDir: "src",
  // add path aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^src/(.*)$": "<rootDir>/$1",
  },
};
