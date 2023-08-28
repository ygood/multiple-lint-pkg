import { ESLint } from 'eslint';
import { globSync } from 'glob';
import fs from 'fs-extra';
import { Config, IPKG, IScanOptions } from '../../types';
import { ESLINT_FILE_EXT } from '../../utils/contans';
import path from 'path';
import getESLintConfigType from './getESLintConfigType';

export default (options: IScanOptions, pkg: IPKG, config: Config) => {
  const { fix, cwd, ignore } = options;
  const lintCfg: ESLint.Options = {
    fix, // 是否修复
    cwd, // 路径
    ignore, // 需要忽略的文件
    extensions: ESLINT_FILE_EXT, // 文件扩展名
    errorOnUnmatchedPattern: false, // 未找到指定文件时报错
  };
  if (config.eslintOptions) {
    // 如果传入配置文件则使用传入的配置
    Object.assign(lintCfg, config.eslintOptions);
  } else {
    // 根据扫描目录下有无lintrc文件，若无则使用默认的 lint 配置
    const lintConfigFiles = globSync('.eslintrc?(.@(js|yaml|yml|json))', { cwd });
    if (lintConfigFiles.length === 0 && !pkg.eslintConfig) {
      // 默认为空。解析插件的目录路径。如果为空，ESLint 将从包含插件设置的配置文件位置加载插件。如果存在路径，ESLint 会从该路径加载所有插件
      lintCfg.resolvePluginsRelativeTo = path.resolve(__dirname, '../../');
      // 默认为 true。如果为 false，ESLint 不会加载配置文件（.eslintrc.* 文件）。只有构造函数选项的配置才有效
      lintCfg.useEslintrc = false;
      lintCfg.baseConfig = {
        extends: [
          // 获取eslint扩展配置
          getESLintConfigType(cwd, pkg),
          //  ESLint 不再管格式问题，直接使用 Prettier 进行格式化
          ...(config.enablePrettier ? ['prettier'] : []),
        ],
      };
    }
    // 根据扫描目录下有无lintignore文件，若无则使用默认的 ignore 配置
    const lintIgnoreFile = path.resolve(cwd, '.eslintignore');
    if (!fs.existsSync(lintIgnoreFile) && !pkg.eslintIgnore) {
      lintCfg.ignorePath = path.resolve(__dirname, '../config/_eslintignore.ejs');
    }
  }
  return lintCfg;
};
