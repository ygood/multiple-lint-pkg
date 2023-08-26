import { globSync } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import {
  ESLINT_IGNORE_PATTERN,
  MARKDOWN_LINT_IGNORE_PATTERN,
  STYLELINT_FILE_EXT,
  STYLELINT_IGNORE_PATTERN,
} from './contans';

export default (cwd: string, data: Record<string, any>) => {
  const templatePath = path.resolve(__dirname, '../config');
  // 获取config目录下所有模板文件
  const templates = globSync(`**/*.ejs`, { cwd: templatePath });
  // 遍历模板文件进行渲染生成
  for (const name of templates) {
    // 替换文件名
    const filepath = path.resolve(cwd, name.replace(/\.ejs$/, '').replace(/^_/, '.'));
    const content = ejs.render(
      fs.readFileSync(path.resolve(templatePath, name), 'utf8'),
      {
        eslintIgnores: ESLINT_IGNORE_PATTERN,
        stylelintExt: STYLELINT_FILE_EXT,
        stylelintIgnores: STYLELINT_IGNORE_PATTERN,
        markdownLintIgnores: MARKDOWN_LINT_IGNORE_PATTERN,
        ...data,
      },
      { async: false },
    );
    // 跳过空文件
    if (!content.trim()) continue;
    // 输出文件
    fs.outputFileSync(filepath, content, 'utf8');
  }
};
