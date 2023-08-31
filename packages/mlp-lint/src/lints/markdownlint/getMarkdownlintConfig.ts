import markdownlint from 'markdownlint';
import path from 'path';
import { globSync } from 'glob';
// import markdownLintConfig from 'mlp-markdownlint-config';
import markdownLintConfig from 'mlp-markdownlint-config';
import { Config, IPKG, IScanOptions } from '../../types';

type LintOptions = markdownlint.Options & { fix?: boolean };

export default (options: IScanOptions, pkg: IPKG, config: Config) => {
  const { cwd } = options;
  const lintConfig: LintOptions = {
    fix: Boolean(options.fix),
    resultVersion: 3,
  };
  if (config.markdownlintOptions) {
    // 若用户传入了 markdownlintOptions，则用用户的
    Object.assign(lintConfig, config.markdownlintOptions);
  } else {
    const lintConfigFiles = globSync('.markdownlint.@(yaml|yml|json)', { cwd });
    if (lintConfigFiles.length === 0) {
      lintConfig.config = markdownLintConfig;
    } else {
      lintConfig.config = markdownlint.readConfigSync(path.resolve(cwd, lintConfigFiles[0]));
    }
  }

  return lintConfig;
};
