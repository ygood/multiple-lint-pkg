import { sync as commandExistsSync } from 'command-exists';

/**
 * npm 类型
 */
const promise: Promise<'npm' | 'pnpm' | 'yarn'> = new Promise((resolve) => {
  if (commandExistsSync('pnpm')) {
    return resolve('pnpm');
  }
  if (commandExistsSync('yarn')) {
    return resolve('yarn');
  }
  resolve('npm');
});

export default promise;
