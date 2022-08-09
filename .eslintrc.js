module.exports = {
  extends: ['prettier', 'prettier/react', 'plugin:prettier/recommended', 'eslint-config-prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn', // 로그 함수 표시
    // 'no-unused-vars': 'warn',
    // 'import/no-unresolved': 'off',
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     trailingComma: 'es5',
    //     singleQuote: true,
    //     printWidth: 100,
    //   },
    // ],
  },
};
