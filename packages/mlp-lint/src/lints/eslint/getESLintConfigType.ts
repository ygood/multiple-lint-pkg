import { IPKG } from '../../types';
import { globSync } from 'glob';

export default (cwd: string, pkg: IPKG) => {
  const tsFiles = globSync('./!(node_modules)/**/*.@(ts|tsx)', { cwd });
  const reactFiles = globSync('./!(node_modules)/**/*.@(jsx|tsx)', { cwd });
  const vueFiles = globSync('./!(node_modules)/**/*.vue', { cwd });
  const dependencies = Object.keys(pkg.dependencies || {});
  const language = tsFiles.length > 0 ? 'typescript' : '';
  let dsl = '';

  // 框架类型判断
  if (reactFiles.length > 0 || dependencies.some((name) => /^react(-|$)/.test(name))) {
    dsl = 'react';
  } else if (vueFiles.length > 0 || dependencies.some((name) => /^vue(-|$)/.test(name))) {
    dsl = 'vue';
  }
  // 如果已/结尾则使用index替换，如果已/开头，则去除开头的/
  const type = `${language}/${dsl}`.replace(/\/$/, '/index').replace(/^\//, '');
  return `mlp-eslint-config/${type}`;
};
