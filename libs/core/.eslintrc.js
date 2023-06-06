module.exports = {
  extends: ['../../.eslintrc.json', 'plugin:rxjs/recommended'],
  ignorePatterns: ['!**/*'],
  plugins: ['rxjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.*?.json'],
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
