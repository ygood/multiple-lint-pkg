import { extname, join } from 'path';
import fg from 'fast-glob';
import { Config, IPKG, IScanOptions } from '../../types';
import { ESLINT_FILE_EXT, ESLINT_IGNORE_PATTERN } from '../../utils/contans';
import { ESLint } from 'eslint';
import getESLintConfig from './getESLintConfig';
import { formatESLintResults } from './formatESLintResults';

export interface DoESLintOptions extends IScanOptions {
  pkg: IPKG;
  config?: Config;
}

export default async (options: DoESLintOptions) => {
  let files: string[] = [];
  if (options.files) {
    files = options.files.filter((name) => ESLINT_FILE_EXT.includes(extname(name)));
  } else {
    const pattern = join(
      options.include,
      `**/*.{${ESLINT_FILE_EXT.map((t) => t.replace(/^\./, '')).join(',')}}`,
    );
    // 查找出所有校验格式的文件
    files = await fg(pattern, {
      cwd: options.cwd,
      ignore: ESLINT_IGNORE_PATTERN,
    });
  }
  // 获取eslint实例eslint
  const eslint = new ESLint(getESLintConfig(options, options.pkg, options.config));
  // eslint校验
  const reports = await eslint.lintFiles(files);
  // 如果存在修复，则将修复过的文件写入文件
  if (options.fix) {
    await ESLint.outputFixes(reports);
  }
  return formatESLintResults(reports, options.quiet, eslint);
};
