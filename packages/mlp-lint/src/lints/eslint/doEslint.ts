import { extname, join } from 'path';
import fg from 'fast-glob';
import { Config, IPKG, IScanOptions } from '../../types';
import { ESLINT_FILE_EXT, ESLINT_IGNORE_PATTERN } from '../../utils/contans';
import { ESLint } from 'eslint';
import getESLintConfig from './getESLintConfig';

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
    files = await fg(pattern, {
      cwd: options.cwd,
      ignore: ESLINT_IGNORE_PATTERN,
    });
    const eslint = new ESLint(getESLintConfig(options, options.pkg, options.config));
    const reports = await eslint.lintFiles(files);
  }
};
