import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'path';
import { LinterOptions } from 'stylelint';
import type { Config, IPKG, IScanOptions } from '../../types';
import { STYLELINT_IGNORE_PATTERN } from '../../utils/contans';

/**
 * 获取 Stylelint 配置
 */
export function getStylelintConfig(opts: IScanOptions, pkg: IPKG, config: Config): LinterOptions {
  const { cwd, fix } = opts;
  if (config.enableStylelint === false) return {} as any;

  const lintConfig: any = {
    fix: Boolean(fix),
    allowEmptyInput: true,
  };

  if (config.stylelintOptions) {
    // 若用户传入了 stylelintOptions，则用用户的
    Object.assign(lintConfig, config.stylelintOptions);
  } else {
    // 根据扫描目录下有无lintrc文件，若无则使用默认的 lint 配置
    const lintConfigFiles = globSync('.stylelintrc?(.@(js|yaml|yml|json))', { cwd });
    if (lintConfigFiles.length === 0 && !pkg.stylelint) {
      lintConfig.config = {
        extends: 'mlp-stylelint-config',
      };
    }

    // 根据扫描目录下有无lintignore文件，若无则使用默认的 ignore 配置
    const ignoreFilePath = path.resolve(cwd, '.stylelintignore');
    if (!fs.existsSync(ignoreFilePath)) {
      lintConfig.ignorePattern = STYLELINT_IGNORE_PATTERN;
    }
  }

  return lintConfig;
}
