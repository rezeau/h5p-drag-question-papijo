import eslintConfigSnordianH5P from 'eslint-config-snordian-h5p';

export default [
  eslintConfigSnordianH5P.configs['flat/recommended'],
  {
    // You can override or extend the rules here
    // For example:
    rules: {
      'no-console': 'warn',
      'no-trailing-spaces': 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      '@stylistic/js/max-len': 'off',"no-magic-numbers": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/no-undefined-types": "off",
      "quotes": ["error", "single"],
    },
  },
];
