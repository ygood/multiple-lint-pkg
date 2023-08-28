import { globSync } from 'glob';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import npmType from './npm-type';
import log from './log';

/**
 * 若无 node_modules，则帮用户 install（否则会找不到 config）
 */
export default async (cwd: string) => {
  const lintConfigFiles = [].concat(
    globSync('.eslintrc?(.@(js|yaml|yml|json))', { cwd }),
    globSync('.stylelintrc?(.@(js|yaml|yml|json))', { cwd }),
    globSync('.markdownlint(.@(yaml|yml|json))', { cwd }),
  );
  const nodeModulesPath = path.resolve(cwd, 'node_modules');

  if (!fs.existsSync(nodeModulesPath) && lintConfigFiles.length > 0) {
    const npm = await npmType;
    log.info(`使用项目 Lint 配置，检测到项目未安装依赖，将进行安装（执行 ${npm} install）`);
    execSync(`cd ${cwd} && ${npm} i`);
  }
};
