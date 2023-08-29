import path from 'path';
import fs from 'fs-extra';
import { Config, IPKG, IScanOptions, ScanResult } from '../types';
import { PKG_NAME } from '../utils/contans';
import execPrettier from '../lints/prettier';
import execEslint from '../lints/eslint';
import execMarkdownlint from '../lints/markdownlint';
import execStylelint from '../lints/stylelint';

export default async (options: IScanOptions) => {
  const { cwd, fix, outputReport, config: scanConfig } = options;
  const readConfigFile = (pth: string): any => {
    const localPath = path.resolve(cwd, pth);
    return fs.existsSync(localPath) ? require(localPath) : {};
  };
  const pkg: IPKG = readConfigFile('package.json');
  const config: Config = scanConfig || readConfigFile(`${PKG_NAME}.config.js`);
  const runErrors: Error[] = [];
  let results: ScanResult[] = [];

  if (fix && config.enablePrettier) {
    await execPrettier(options);
  }

  if (config.enableESLint) {
    try {
      const eslintResults = await execEslint({ ...options, pkg, config });
      results = results.concat(eslintResults);
    } catch (e) {
      runErrors.push(e);
    }
  }

  if (config.enableMarkdownlint) {
    try {
      const markdownlintResults = await execMarkdownlint({ ...options, pkg, config });
      results = results.concat(markdownlintResults);
    } catch (e) {
      runErrors.push(e);
    }
  }

  if (config.enableStylelint) {
    try {
      const styleResults = await execStylelint({ ...options, pkg, config });
      results = results.concat(styleResults);
    } catch (e) {
      runErrors.push(e);
    }
  }

  // 生成报告报告文件
  if (outputReport) {
    const reportPath = path.resolve(process.cwd(), `./${PKG_NAME}-report.json`);
    fs.outputFile(reportPath, JSON.stringify(results, null, 2), () => {});
  }

  return {
    results,
    errorCount: results.reduce((count, { errorCount }) => count + errorCount, 0),
    warningCount: results.reduce((count, { warningCount }) => count + warningCount, 0),
    runErrors,
  };
};
