import airbnbBase from 'eslint-config-airbnb-base';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        global: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    ...airbnbBase.rules,
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  },
];
