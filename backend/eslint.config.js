const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 12,
      sourceType: "commonjs"
    },
    rules: {
    },
    ignores: ["node_modules/", "frontend/dist/"]
  },
];
