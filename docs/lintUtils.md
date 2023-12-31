---
nav:
  title: lint工具包
  order: 1
---

# lint工具包

包含多种lint包集合，markdown,css,less,sass,js,ts,vue,react以及node等

## mlp-markdownlint-config

> 文档 规范

支持配套的 [markdownlint 可共享配置](https://www.npmjs.com/package/markdownlint#optionsconfig)。

### 安装

需要先行安装 [markdownlint](https://www.npmjs.com/package/markdownlint)：

```bash
pnpm install mlp-markdownlint-config markdownlint --save-dev
```

### 使用

在 `.markdownlint.json` 中继承本包:

```json
{
  "extends": "mlp-markdownlint-config"
}
```

## mlp-stylelint-config

支持配套的 [stylelint 可共享配置](https://stylelint.io/user-guide/configure)。

### 安装

需要先行安装 [stylelint](https://www.npmjs.com/package/stylelint) 和 [stylelint-scss](https://www.npmjs.com/package/stylelint-scss)：

```bash
npm install mlp-stylelint-config stylelint stylelint-scss postcss-scss --save-dev
```

### 使用

在 `.stylelintrc` 中继承本包:

```json
{
  "extends": "mlp-stylelint-config"
}
```

## eslint-config-mlp

> JavaScript TypeScript Node 规范

提供了多套配置文件以支持 `JavaScript`、`TypeScript`、`React`、`Vue`、`Node.js` 等多种项目类型。

### JavaScript 项目 - eslint-config-mlp

针对未使用 `React` 或 `Vue` 的原生 `JavaScript` 项目，使用 `ESLint` 原生规则和 [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) 规则，使用 [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) 作为 `parser`，是本包的默认配置。

#### 依赖

- [@babel/core](https://www.npmjs.com/package/@babel/core)@^7.22.10
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.22.10
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1

#### 安装

```shell
npm i -D eslint-config-mlp @babel/core @babel/eslint-parser eslint-plugin-import
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp"]
}
```

### JavaScript + React 项目 - eslint-config-mlp/react

针对 JS React 项目，继承了默认配置，并启用了 [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) 和 [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) 的规则。

#### 依赖

- [@babel/core](https://www.npmjs.com/package/@babel/core)@^7.22.10
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.22.10
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)@^7.33.2
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/)@^4.6.0
- [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)@^6.7.1（可选）

#### 安装

```shell
npm i -D eslint-config-mlp @babel/core @babel/eslint-parser eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/react"]
}
```

如果需要无障碍能力：

```shell
npm i -D eslint-plugin-jsx-a11y
```

```json
{
  "extends": ["eslint-config-mlp/react", "eslint-config-mlp/jsx-a11y"]
}
```

### JavaScript + Vue 项目 - eslint-config-mlp/vue

针对 `JS Vue` 的项目，继承了默认配置，并启用了 [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue) 插件的规则，使用 [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser) 作为 parser。

#### 依赖

- [@babel/core](https://www.npmjs.com/package/@babel/core)@^7.22.10
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.22.10
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@^9.3.1
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)@^9.17.0

#### 安装

```shell
npm i -D eslint-config-mlp @babel/core @babel/eslint-parser eslint-plugin-import vue-eslint-parser eslint-plugin-vue
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/vue"]
}
```

### JavaScript (Node.js) 项目 - eslint-config-mlp/node

针对 Node.js 项目，继承了默认配置和 [eslint-config-egg 的规则](https://github.com/eggjs/eslint-config-egg/blob/master/lib/rules/node.js)，规则由 ESLint 原生规则和 [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node) 提供。

#### 依赖

- [@babel/core](https://www.npmjs.com/package/@babel/core)@^7.22.10
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.22.10
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [eslint-config-egg](https://www.npmjs.com/package/eslint-config-egg)@^12.2.1

#### 安装

```shell
npm i -D eslint-config-mlp @babel/core @babel/eslint-parser eslint-plugin-import eslint-config-egg
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/node"]
}
```

### TypeScript 项目 - eslint-config-mlp/typescript

针对未使用 `React` 或 `Vue` 的 `TypeScript` 项目，继承了默认配置，并启用了 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 插件的规则，使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) 作为 parser。

#### 依赖

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^6.4.1
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^6.4.1
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)@3.6.0

#### 安装

```shell
npm i -D eslint-config-mlp @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/typescript"]
}
```

需保证项目已安装 `typescript` 依赖，另外如果项目的 `TS` 配置文件不是 `./tsconfig.json`，则需要设置 `.eslintrc` 中的 [parserOptions.project](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#parseroptionsproject) 字段 ，例如：

```json
{
  "extends": "eslint-config-mlp/typescript",
  "parserOptions": {
    "project": "./tsconfig.eslint.json"
  }
}
```

### TypeScript + React 项目 - eslint-config-mlp/typescript/react

针对 `TS React` 项目，继承了 `JS React` 的配置，并启用了 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 插件的规则，使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) 作为 parser。

#### 依赖

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^6.4.1
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^6.4.1
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)@3.6.0
- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)@^7.33.2
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)@^4.6.0
- [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)@^6.7.1（可选）

#### 安装

```sh
npm i -D eslint-config-mlp @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript eslint-plugin-react eslint-plugin-react-hooks
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/typescript/react"]
}
```

如果需要无障碍能力：

```shell
npm i -D  eslint-plugin-jsx-a11y
```

```json
{
  "extends": [
    "eslint-config-mlp/typescript/react",
    "eslint-config-mlp/jsx-a11y"
  ]
}
```

### TypeScript + Vue 项目 - eslint-config-mlp/typescript/vue

针对 `TS Vue` 项目，继承了 `JS Vue` 的配置，并启用了 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 插件的规则，使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) 作为 `parser`。

#### 依赖

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^6.4.1
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^6.4.1
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)@3.6.0
- [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@^9.3.1
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)@^9.17.0

#### 安装

```shell
npm i -D eslint-config-mlp @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript vue-eslint-parser eslint-plugin-vue
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/typescript/vue"]
}
```

### TypeScript (Node.js) 项目 - eslint-config-mlp/typescript/node

针对未使用 `React` 和 `Vue` 的 `TypeScript(Node)` 项目，继承了 `JS Node.js` 配置，并启用了 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 插件的规则，使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) 作为 parser。

#### 依赖

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^6.4.1
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^6.4.1
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.28.1
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)@3.6.0
- [eslint-config-egg](https://www.npmjs.com/package/eslint-config-egg)@^12.2.1

#### 安装

```sh
npm i -D eslint-config-mlp @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript eslint-config-egg
```

#### 配置

```json
{
  "extends": ["eslint-config-mlp/typescript/node"]
}
```

### 配合 Prettier 使用

如果你的项目使用 [Prettier](https://prettier.io/) 进行代码格式化，本包的一些规则可能会跟 Prettier 格式化结果有冲突，[例如这条规则](https://github.com/typescript-eslint/typescript-eslint/issues/372)。为了避免冲突，你需要手动安装 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 和 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)：

#### 安装

```sh
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

#### 配置

并修改 `.eslintrc` 的 `extends` 配置，增加 `prettier`，如下（以 TS React 项目为例）：

```json
{
  "extends": ["eslint-config-mlp/typescript/react", "prettier"]
}
```

了解更多请阅读 [Prettier - Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)。

### 了解更多

- 如果你对 ESLint 还不熟悉，可以阅读官网的 [Getting Started](https://eslint.org/docs/user-guide/getting-started) 快速入门。
- 了解如何为 IDE 配置 ESLint，可以参考官网的 [Integrations](http://eslint.org/docs/user-guide/integrations)。
- 了解如何在继承本包的基础上对项目 ESLint 进行个性化配置，可参考官网的 [Configuring ESLint](https://eslint.org/docs/user-guide/configuring)。下面简介下 ESLint 配置中的几个常用字段：
  - `extends`: 继承一组规则集。`"extends": "eslint-config-mlp",` 表示继承本包定义的规则配置。
  - `rules`: 配置规则，这里定义的规则会覆盖 `extends` 的规则。如果觉得本包开启的某条规则过于严格，你可以暂时在这里将其关闭。
  - `parser`: 设置 ESLint 的解析器。ESLint 使用 espree 作为默认的解析器，可以通过这个参数指定其他的解析器。比如指定为 [@babel/eslint-parser](https://npmjs.com/package/@babel/eslint-parser)，以解析 Babel 支持但 ESLint 默认解析器不支持的语法（本包不同配置文件使用的解析器可在简介表格中的「依赖 parser」一列查看）。
  - `globals`: 指定代码中可能用到的全局变量，以免全局变量被 [no-undef](http://eslint.org/docs/rules/no-undef) 规则报错。
  - `env`: 指定代码的运行环境，每个环境预定义了一组对应的全局变量，本包已开启的环境有 browser、node、jquery、es6 及几个测试框架的环境。
- 了解常用的 ESLint 命令，如 `--fix`、`--ext`，可参考官网的 [Command Line Interface](http://eslint.org/docs/user-guide/command-line-interface)。

## @mlpconfig/commitlint-config

> Git commit 规范

支持配套的 [commitlint 配置](https://commitlint.js.org/#/concepts-shareable-config)，用于对 `git commit message` 进行校验。

### 安装

使用时，需要安装 [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli)，推荐使用pnpm：

```bash
# pnpm
pnpm install @mlpconfig/commitlint-config @commitlint/cli --save-dev

# yarn
yarn add @mlpconfig/commitlint-config @commitlint/cli --save-dev

# npm
npm install @mlpconfig/commitlint-config @commitlint/cli --save-dev
```

### 使用

在 `commitlint.config.js` 中集成本包:

```javascript
module.exports = {
  extends: ['@mlpconfig/commitlint-config'],
};
```

### 设置 git hook

可通过 [husky](https://www.npmjs.com/package/husky) 设置在 `git commit` 时触发 `commitlint`。

首先安装 husky：

```bash
npm install husky --save-dev
```

然后执行添加`commit-msg`:

```bash
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

更多信息可参考 [commitlint 文档](https://commitlint.js.org/#/guides-local-setup?id=install-husky)。
