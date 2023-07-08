const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@douglasneuroinformatics'],
  ignorePatterns: ['dist/**/*'],
  env: {
    node: true
  },
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json')
  },
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc'
        },
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'external',
            pattern: '@nestjs/**',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['@nestjs']
      }
    ]
  }
};