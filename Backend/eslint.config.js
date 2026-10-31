import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "public/**", "coverage/**"] },
  js.configs.recommended,
  {
    files: ["agent/**/*.js", "services/**/*.js", "routes/evaluation.routes.js", "middleware/errorHandler.js", "openapi.js", "config/logger.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_" }] },
  },
];
