export interface InitOptions {
  /** Project directory (defaults to process.cwd()) */
  cwd?: string;
  /** Skip installing vite-basepath */
  skipInstall?: boolean;
  /** Skip patching vite.config */
  skipViteConfig?: boolean;
  /** Skip router basename patching */
  skipRouter?: boolean;
  /** Skip creating GitHub Actions workflow */
  skipCi?: boolean;
  /** Node.js version for CI workflow */
  nodeVersion?: string;
  /** Build output directory */
  outDir?: string;
  /** Run non-interactively with defaults */
  yes?: boolean;
}

export interface InitResult {
  success: boolean;
  steps: string[];
  warnings: string[];
  pagesUrl?: string;
}
