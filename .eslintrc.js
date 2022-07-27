module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:import/typescript',
    require.resolve('@umijs/fabric/dist/eslint'),
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  plugins: ['react', '@typescript-eslint', 'import', 'react-redux'],
  rules: {
    /**
     * using @typescript-eslint/no-use-before-define instead
     * see https://github.com/typescript-eslint/typescript-eslint/issues/2540
     */
    'no-use-before-define': 'off',
    'import/no-unresolved': 'error',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': 'off',
    'no-restricted-exports': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { destructuredArrayIgnorePattern: '^_' },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
