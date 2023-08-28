import path from 'path';
import fs from 'fs-extra';
import { Config, IPKG, IScanOptions, ScanResult } from '../types';
import { PKG_NAME } from '../utils/contans';

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

  if (config.enablePrettier) {
    // TODO
  }
  if (config.enableESLint) {
    // TODO
  }
  if (config.enableMarkdownlint) {
    // TODO
  }
  if (config.enableStylelint) {
    // TODO
  }
};
