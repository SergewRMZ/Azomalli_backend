import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": ["error", { endOfLine: "lf" }]
    },
  },
  prettierConfig, 
];

