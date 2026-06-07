import { init, printSummary } from './commands/init.js';
import { detectPackageManager, detectProject } from './utils/detect.js';

const HELP = `
${'\x1b[1m'}vite-on-github\x1b[0m — Prepare any Vite project for GitHub Pages

\x1b[1mUsage:\x1b[0m
  npx vite-on-github [command] [options]

\x1b[1mCommands:\x1b[0m
  init          Set up vite config, base paths, router, and CI (default)
  help          Show this help

\x1b[1mOptions:\x1b[0m
  -y, --yes           Skip prompts, use defaults
  --skip-install      Do not install vite-basepath
  --skip-vite-config  Do not patch vite.config
  --skip-router       Do not patch React/Vue router
  --skip-ci           Do not create GitHub Actions workflow
  --node <version>    Node.js version for CI (default: 22)
  --out-dir <dir>     Build output directory (default: dist)

\x1b[1mExamples:\x1b[0m
  npx vite-on-github
  npx vite-on-github init
  npx vite-on-github init -y
  npx vite-on-github init --node 20 --out-dir dist
`;

function parseArgs(argv: string[]): {
  command: string;
  options: {
    yes: boolean;
    skipInstall: boolean;
    skipViteConfig: boolean;
    skipRouter: boolean;
    skipCi: boolean;
    nodeVersion?: string;
    outDir?: string;
  };
} {
  const args = argv.slice(2);
  let command = 'init';

  const options = {
    yes: false,
    skipInstall: false,
    skipViteConfig: false,
    skipRouter: false,
    skipCi: false,
    nodeVersion: undefined as string | undefined,
    outDir: undefined as string | undefined,
  };

  let i = 0;
  if (args[0] && !args[0].startsWith('-')) {
    command = args[0];
    i = 1;
  }

  for (; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-y':
      case '--yes':
        options.yes = true;
        break;
      case '--skip-install':
        options.skipInstall = true;
        break;
      case '--skip-vite-config':
        options.skipViteConfig = true;
        break;
      case '--skip-router':
        options.skipRouter = true;
        break;
      case '--skip-ci':
        options.skipCi = true;
        break;
      case '--node':
        options.nodeVersion = args[++i];
        break;
      case '--out-dir':
        options.outDir = args[++i];
        break;
      default:
        break;
    }
  }

  return { command, options };
}

async function main(): Promise<void> {
  const { command, options } = parseArgs(process.argv);

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  if (command !== 'init') {
    console.error(`Unknown command: ${command}\nRun "vite-on-github help" for usage.`);
    process.exit(1);
  }

  const cwd = process.cwd();
  const project = detectProject(cwd);
  const pm = project?.packageManager ?? detectPackageManager(cwd);

  const result = await init({
    cwd,
    yes: options.yes,
    skipInstall: options.skipInstall,
    skipViteConfig: options.skipViteConfig,
    skipRouter: options.skipRouter,
    skipCi: options.skipCi,
    nodeVersion: options.nodeVersion,
    outDir: options.outDir,
  });

  if (!result.success) {
    console.error(result.warnings[0] ?? 'Setup failed');
    process.exit(1);
  }

  printSummary(result, pm);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
