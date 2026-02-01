export default {
  testEnvironment: "node",

  // No transforms – let Node handle ESM
  transform: {},

  testPathIgnorePatterns: ["/node_modules/"],

  setupFiles: ["dotenv/config"],

  // ⏱ Global timeout for DB tests
  testTimeout: 30000
};
