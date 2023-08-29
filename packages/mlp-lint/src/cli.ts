#!/usr/bin/env node
import { program } from 'commander';
import { PKG_NAME, PKG_VERSION } from './utils/contans';
import init from './action/init';
import installDeps from './utils/install-deps';
import ora from 'ora';
import scan from './action/scan';
import printReport from './utils/print-report';
// import path from 'path';
// import generateTemplate from './utils/generate-template';

const cwd = process.cwd();

program
  .version(PKG_VERSION)
  .description(
    `${PKG_NAME} 是 multiple lint pkg 的配套 Lint 工具，提供简单的 CLI 和 Node.js API，让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡点，降低项目实施规范的成本`,
  );
program
  .command('init')
  .description('一键接入：为项目初始化规范工具和配置，可以根据项目类型和需求进行定制')
  .option('--vscode', '写入.vscode/setting.json配置')
  .action(async (cmd) => {
    if (cmd.vscode) {
      // const configPath = path.resolve(cwd, `${PKG_NAME}.config.js`);
      // generateTemplate(cwd, require(configPath), true);
    } else {
      await init({
        cwd,
        checkVersionUpdate: true,
      });
    }
  });

program
  .command('scan')
  .description('一键扫描：对项目进行代码规范问题扫描')
  .option('-q, --quiet', '仅报告错误信息 - 默认: false')
  .option('-o, --output-report', '输出扫描出的规范问题日志')
  .option('-i, --include <dirpath>', '指定要进行规范扫描的目录')
  .option('--no-ignore', '忽略 eslint 的 ignore 配置文件和 ignore 规则')
  .action(async (cmd) => {
    await installDeps(cwd);
    const checking = ora();
    checking.start(`执行 ${PKG_NAME} 代码检查`);

    const { results, errorCount, warningCount, runErrors } = await scan({
      cwd,
      fix: false,
      include: cmd.include || cwd,
      quiet: Boolean(cmd.quiet),
      outputReport: Boolean(cmd.outputReport),
      ignore: cmd.ignore, // 对应 --no-ignore
    });
    let type = 'succeed';
    if (runErrors.length > 0 || errorCount > 0) {
      type = 'fail';
    } else if (warningCount > 0) {
      type = 'warn';
    }

    checking[type]();
    if (results.length > 0) {
      printReport(results, false);
    }
    // 输出 lint 运行错误
    runErrors.forEach((e) => console.log(e));
  });

program
  .command('fix')
  .description('一键扫描：对项目进行代码规范问题扫描')
  .option('-q, --quiet', '仅报告错误信息 - 默认: false')
  .option('-o, --output-report', '输出扫描出的规范问题日志')
  .option('-i, --include <dirpath>', '指定要进行规范扫描的目录')
  .option('--no-ignore', '忽略 eslint 的 ignore 配置文件和 ignore 规则')
  .action(async (cmd) => {
    await installDeps(cwd);
    const checking = ora();
    checking.start(`执行 ${PKG_NAME} 代码检查`);

    const { results, errorCount, warningCount, runErrors } = await scan({
      cwd,
      fix: true,
      include: cmd.include || cwd,
      quiet: Boolean(cmd.quiet),
      outputReport: Boolean(cmd.outputReport),
      ignore: cmd.ignore, // 对应 --no-ignore
    });
    let type = 'succeed';
    if (runErrors.length > 0 || errorCount > 0) {
      type = 'fail';
    } else if (warningCount > 0) {
      type = 'warn';
    }

    checking[type]();
    if (results.length > 0) {
      printReport(results, false);
    }
    // 输出 lint 运行错误
    runErrors.forEach((e) => console.log(e));
  });

program.parse(process.argv);
