import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { globSync } from 'glob';
import { PKG } from '../types';
import log from './log';
import { PKG_NAME } from './contans';

// 精确移除依赖
const packageNamesToRemove = [
  '@babel/eslint-parser',
  '@commitlint/cli',
  '@iceworks/spec',
  'babel-eslint',
  'eslint',
  'husky',
  'markdownlint',
  'prettier',
  'stylelint',
  'tslint',
];

// 按前缀移除依赖
const packagePrefixesToRemove = [
  '@commitlint/',
  '@typescript-eslint/',
  'eslint-',
  'stylelint-',
  'markdownlint-',
  'commitlint-',
];

/**
 * 待删除的无用配置
 * @param cwd
 */
const checkUselessConfig = (cwd: string): string[] => {
  return []
    .concat(globSync('.eslintrc?(.@(yaml|yml|json|js|cjs))', { cwd }))
    .concat(globSync('.stylelintrc?(.@(yaml|yml|json|js|cjs))', { cwd }))
    .concat(globSync('.markdownlint@(rc|.@(yaml|yml|json))', { cwd }))
    .concat(globSync('.prettierrc?(.@(cjs|config.js|config.cjs|yaml|yml|json))', { cwd }))
    .concat(globSync('tslint.@(yaml|yml|json)', { cwd }));
};

/**
 * 待重写的配置
 * @param cwd
 */
const checkReWriteConfig = (cwd: string) => {
  return globSync('**/*.ejs', { cwd: path.resolve(__dirname, '../config') })
    .map((name) => name.replace(/^_/, '.').replace(/\.ejs$/, ''))
    .filter((filename) => fs.existsSync(path.resolve(cwd, filename)));
};

export default async (cwd: string, rewriteConfig?: boolean) => {
  const pkgPath = path.resolve(cwd, 'package.json');
  const pkg: PKG = fs.readJSONSync(pkgPath);
  const dependencies = [].concat(
    Object.keys(pkg.dependencies || {}),
    Object.keys(pkg.devDependencies || []),
  );
  // 过滤出会和lint工具冲突的依赖
  const willRemovePackage = dependencies.filter(
    (name) =>
      packageNamesToRemove.includes(name) ||
      packagePrefixesToRemove.some((prefix) => name.startsWith(prefix)),
  );
  // 查找需要删除的配置文件
  const uselessConfig = checkUselessConfig(cwd);
  // 查找需要重写的配置
  const reWriteConfig = checkReWriteConfig(cwd);
  const willChangeCount = willRemovePackage.length + uselessConfig.length + reWriteConfig.length;
  // 存在需要删除或者覆盖的配置，提示用户
  if (willChangeCount > 0) {
    log.warn(`检测到项目中存在可能与 ${PKG_NAME} 冲突的依赖和配置，为保证正常运行将`);

    if (willRemovePackage.length > 0) {
      log.warn('删除以下依赖：');
      log.warn(JSON.stringify(willRemovePackage, null, 2));
    }

    if (uselessConfig.length > 0) {
      log.warn('删除以下配置文件：');
      log.warn(JSON.stringify(uselessConfig, null, 2));
    }

    if (reWriteConfig.length > 0) {
      log.warn('覆盖以下配置文件：');
      log.warn(JSON.stringify(reWriteConfig, null, 2));
    }
    // 提示用户确认是否重写配置文件
    if (typeof rewriteConfig === 'undefined') {
      const { isOverWrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'isOverWrite',
        message: '请确认是否继续：',
      });
      if (!isOverWrite) process.exit(0);
    } else if (!reWriteConfig) {
      process.exit(0);
    }
  }
  // 删除需要配置文件
  for (const name of uselessConfig) {
    fs.removeSync(path.resolve(cwd, name));
  }

  // 修正 package.json，删除用户自定义的一些lint配置，以及删除可能冲突的依赖
  delete pkg.eslintConfig;
  delete pkg.eslintIgnore;
  delete pkg.stylelint;
  for (const name of willRemovePackage) {
    delete (pkg.dependencies || {})[name];
    delete (pkg.devDependencies || {})[name];
  }
  // 重写package.json配置
  // fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');

  return pkg;
};
