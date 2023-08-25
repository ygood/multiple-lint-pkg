export interface InitOptions {
  cwd: string;
  checkVersionUpdate: boolean;
  enableESLint?: boolean;
  enableStylelint?: boolean;
  enableMarkdownlint?: boolean;
  enablePrettier?: boolean;
  rewriteConfig?: boolean;
  eslintType?: string;
}

export interface PKG {
  eslintConfig?: any;
  eslintIgnore?: string[];
  stylelint?: any;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;

  [key: string]: any;
}
