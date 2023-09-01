# multiple-lint-pkg

## 简介

一个集成多个lint工具的工具。包括eslint，commitlint，markdownlint以及stylelint，并且配备了对应的脚手架工具，实现一键接入，一键扫描与修复等

## 工具包

### mlp-stylelint-config

style 检查工具包

### mlp-markdownlint-config

markdown 检查工具包

### eslint-config-mlp

eslint 检查工具包

### @mlpconfig/commitlint-config

commitlint 检查工具包

### mlp-lint

配套的脚手架工具

## 开发命令行

```bash
# 安装依赖
$ pnpm run init

# 清除依赖和子包依赖
$ pnpm run clean

# 开发启动文档
$ pnpm run docs:dev

# 编译文档
$ pnpm run docs:build

# 部署文档到静态站点
$ pnpm run docs:deploy
```

## LICENSE

MIT
