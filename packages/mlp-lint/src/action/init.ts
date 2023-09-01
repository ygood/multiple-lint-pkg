import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import spawn from 'cross-spawn';
import npmType from '../utils/npm-type';
import { PKG_NAME, PROJECT_TYPES } from '../utils/contans';
import { IInitOptions, IPKG } from '../types';
import log from '../utils/log';
import conflictResolve from '../utils/conflict-resolve';
import generateTemplate from '../utils/generate-template';
import execa from 'execa';

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

/**
 * 选择是否启用 Husky
 */
const chooseEnableHusky = async () => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 Husky 用于代码提交检查`,
    default: true,
  });

  return enable;
};

export default async (options: IInitOptions) => {
  const cwd = options.cwd || process.cwd();
  const pkgPath = path.resolve(cwd, 'package.json');
  const config: Record<string, any> = {};
  const isTest = process.env.NODE_ENV === 'test';
  const disableNpmInstall = options.disableNpmInstall || false;
  let pkg: IPKG = fs.readJSONSync(pkgPath);

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
    // 处理之前项目中的可能存在依赖冲突和配置文件冲突
    log.info(`Step ${++step}. 检查并处理项目中可能存在的依赖和配置冲突`);
    pkg = await conflictResolve(cwd, options.rewriteConfig);
    log.success(`Step ${step}. 已完成项目依赖和配置冲突检查处理 :D`);
    if (!disableNpmInstall) {
      log.info(`Step ${++step}. 安装依赖`);
      const npm = await npmType;
      // 安装当前包的依赖
      spawn.sync(npm, ['i', '-D', PKG_NAME], { stdio: 'inherit', cwd });
      // spawn.sync(npm, ['-h'], { stdio: 'inherit', cwd });
      log.success(`Step ${step}. 安装依赖成功 :D`);
    }
  }

  // 配置 git hooks
  const enableHusky = await chooseEnableHusky();
  if (enableHusky) {
    log.info(`Step ${++step}. 安装husky相关依赖`);
    const npm = await npmType;
    // 安装当前包的依赖
    spawn.sync(npm, ['i', '-D', 'husky', 'lint-staged'], { stdio: 'inherit', cwd });
    log.success(`Step ${step}. 安装husky相关依赖 :D`);
  }

  // 更新 pkg.json
  pkg = fs.readJSONSync(pkgPath);
  // 在 `package.json` 中写入 `scripts`
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  if (!pkg.scripts[`${PKG_NAME}-scan`]) {
    pkg.scripts[`${PKG_NAME}-scan`] = `${PKG_NAME} scan`;
  }
  if (!pkg.scripts[`${PKG_NAME}-fix`]) {
    pkg.scripts[`${PKG_NAME}-fix`] = `${PKG_NAME} fix`;
  }

  if (enableHusky) {
    log.info(`Step ${++step}. 配置 git commit 代码校验，以及commit-msg校验`);
    if (!pkg['lint-staged']) pkg['lint-staged'] = {};
    pkg['lint-staged'][
      'src/**/*.{js,jsx,ts,tsx,css,less,scss,md}'
    ] = `${PKG_NAME} commit-file-scan`;
    log.success(`Step ${step}. 配置 git commit 代码校验，以及commit-msg校验成功 :D`);
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // 生成对应的配置文件
  log.info(`Step ${++step}. 写入配置文件`);
  generateTemplate(cwd, config);
  log.success(`Step ${step}. 写入配置文件成功 :D`);

  // 判断是否存在git命令
  let existGit = true;
  if (enableHusky) {
    try {
      await execa('git', ['-v']);
    } catch (error) {
      log.warn(`当前环境不存在git工具，请安装git后执行以下命令`);
      log.warn(`1. git init`);
      log.warn(`2. npx husky install`);
      log.warn(`3. npx husky add .husky/commit-msg "npx commitlint --edit $1"`);
      log.warn(`4. npx husky add .husky/pre-commit "npm exec lint-staged"`);
      existGit = false;
    }
  }

  // 生成husky脚本
  if (enableHusky && existGit) {
    const gitPath = path.resolve(cwd, '.git');
    // 判断是否存在.git文件，不存在则自动执行git init 命令
    if (!fs.existsSync(gitPath)) {
      log.info(`当前目录未进行git初始化，自动执行git init`);
      spawn.sync('git', ['init'], { stdio: 'inherit', cwd });
      log.success(`git 初始化完成`);
    }
    // 初始化husky
    log.info(`Step ${++step}. 生成husy脚本配置`);
    spawn.sync('npx', ['husky', 'install'], { stdio: 'inherit', cwd });
    spawn.sync('npx', ['husky', 'add', '.husky/commit-msg', 'npx commitlint --edit $1'], {
      stdio: 'inherit',
      cwd,
    });
    spawn.sync('npx', ['husky', 'add', '.husky/pre-commit', 'npm exec lint-staged'], {
      stdio: 'inherit',
      cwd,
    });
    log.success(`Step ${step}. 生成husy脚本配置 :D`);
  }

  // 完成信息
  const logs = [`${PKG_NAME} 初始化完成 :D`].join('\r\n');
  log.success(logs);
};
