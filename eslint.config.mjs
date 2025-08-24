import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      '@next/next': nextPlugin,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...prettier.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
];
