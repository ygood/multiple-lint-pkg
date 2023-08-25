import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import { PROJECT_TYPES } from '../utils/contans';
import { InitOptions, PKG } from '../types';
import log from '../utils/log';
import conflictResolve from '../utils/conflict-resolve';

let step = 0;

/**
 * 选择项目语言和框架
 */
const chooseEslintType = async () => {
  const { type } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: `Step ${++step}. 请选择项目的语言（JS/TS）和框架（React/Vue）类型：`,
    choices: PROJECT_TYPES,
  });

  return type;
};

/**
 * 选择是否启用 stylelint
 * @param defaultValue
 */
const chooseEnableStylelint = async (defaultValue: boolean): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 stylelint（若没有样式文件则不需要）：`,
    default: defaultValue,
  });

  return enable;
};

/**
 * 选择是否启用 markdownlint
 */
const chooseEnableMarkdownLint = async () => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 markdownlint（若没有markdown文件则不需要）：`,
    default: true,
  });

  return enable;
};

/**
 * 选择是否启用 Prettier
 */
const chooseEnablePrettier = async () => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 Prettier 用于代码优化`,
    default: true,
  });

  return enable;
};

export default async (options: InitOptions) => {
  const cwd = options.cwd || process.cwd();
  const pkgPath = path.resolve(cwd, 'package.json');
  const config: Record<string, any> = {};
  const isTest = process.env.NODE_ENV === 'test';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let pkg: PKG = fs.readJSONSync(pkgPath);

  // 初始化 `enableESLint`，是否启用esLint
  if (typeof options.enableESLint === 'boolean') {
    config.enableESLint = options.enableESLint;
  } else {
    config.enableESLint = true;
  }

  // 确定项目类型
  if (options.eslintType && PROJECT_TYPES.find((pro) => pro.value === options.eslintType)) {
    config.eslintType = options.eslintType;
  } else {
    config.eslintType = await chooseEslintType();
  }

  // 初始化 `enableStylelint`，是否启用styleLint,node项目默认不启用
  if (typeof options.enableStylelint === 'boolean') {
    config.enableStylelint = options.enableStylelint;
  } else {
    config.enableStylelint = await chooseEnableStylelint(!/node/.test(config.eslintType));
  }

  // 初始化 `enableMarkdownlint`
  if (typeof options.enableMarkdownlint === 'boolean') {
    config.enableMarkdownlint = options.enableMarkdownlint;
  } else {
    config.enableMarkdownlint = await chooseEnableMarkdownLint();
  }

  // 初始化 `enablePrettier`
  if (typeof options.enablePrettier === 'boolean') {
    config.enablePrettier = options.enablePrettier;
  } else {
    config.enablePrettier = await chooseEnablePrettier();
  }

  if (!isTest) {
    log.info(`Step ${++step}. 检查并处理项目中可能存在的依赖和配置冲突`);
    pkg = await conflictResolve(cwd, options.rewriteConfig);
    log.success(`Step ${step}. 已完成项目依赖和配置冲突检查处理 :D`);
    console.log(pkg);
    // if (!disableNpmInstall) {
    //   log.info(`Step ${++step}. 安装依赖`);
    //   const npm = await npmType;
    //   spawn.sync(npm, ['i', '-D', PKG_NAME], { stdio: 'inherit', cwd });
    //   log.success(`Step ${step}. 安装依赖成功 :D`);
    // }
  }
};
