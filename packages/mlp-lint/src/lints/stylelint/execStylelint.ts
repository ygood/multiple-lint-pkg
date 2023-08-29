import { extname, join } from 'path';
import fg from 'fast-glob';
import { Config, IPKG, IScanOptions } from '../../types';
import { STYLELINT_FILE_EXT, STYLELINT_IGNORE_PATTERN } from '../../utils/contans';
import stylelint from 'stylelint';
import { getStylelintConfig } from './getStylelintConfig';
import { formatStylelintResults } from './formatStylelintResults';

export interface DostyleLintOptions extends IScanOptions {
  pkg: IPKG;
  config?: Config;
}

export default async (options: DostyleLintOptions) => {
  let files: string[] = [];
  if (options.files) {
    files = options.files.filter((name) => STYLELINT_FILE_EXT.includes(extname(name)));
  } else {
    const pattern = join(
      options.include,
      `**/*.{${STYLELINT_FILE_EXT.map((t) => t.replace(/^\./, '')).join(',')}}`,
    );
    // 查找出所有校验格式的文件
    files = await fg(pattern, {
      cwd: options.cwd,
      ignore: STYLELINT_IGNORE_PATTERN,
    });
  }
  const data = await stylelint.lint({
    ...getStylelintConfig(options, options.pkg, options.config),
    files,
  });
  return formatStylelintResults(data.results, options.quiet);
};
