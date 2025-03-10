import globals from 'globals';
import pluginJs from '@eslint/js';
//import pluginReact from 'eslint-plugin-react';
import css from '@eslint/css';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  //pluginReact.configs.flat.recommended,
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        jQuery: 'readonly',
        $: 'readonly', // also jQuery
        Handlebars: 'readonly',
        Akumina: 'readonly',
      },
    },
    // There are some libraries available to the scripts that are not imported.
    // Defining them here to avoid global errors.
  },
  {
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    languageOptions: {
      tolerant: true,
    },
    ...css.configs.recommended22,
    rules: {
      'css/no-duplicate-imports': 'error',
      'css/no-empty-blocks': 'error',
      'css/no-invalid-at-rules': 'error',
      'css/no-invalid-properties': 'error',
      'css/require-baseline': 'warn',
      //'css/use-layers': 'error',
      // Temporarily turn off due to bug in CSS lint module
      'no-irregular-whitespace': 'off',
    },
  },
  { languageOptions: { globals: globals.browser } },
];
