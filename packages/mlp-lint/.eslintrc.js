module.exports = {
  extends: ['../eslint-config/typescript/node', 'prettier'],
  parserOptions: {
    project: './tsconfig.json', // default project config
    createDefaultProgram: true, // 兼容未在 tsconfig.json 中 provided 的文件
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-require-imports': 0,
    'no-console': 0,
  },
};
