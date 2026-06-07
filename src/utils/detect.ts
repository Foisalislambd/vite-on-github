import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { findFirstExisting, readText } from './fs.js';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type Framework = 'react' | 'vue' | 'svelte' | 'solid' | 'unknown';

export interface ProjectInfo {
  cwd: string;
  packageManager: PackageManager;
  viteConfigPath: string | null;
  framework: Framework;
  hasReactRouter: boolean;
  hasVueRouter: boolean;
  packageJsonPath: string;
}

const VITE_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.js',
  'vite.config.mts',
  'vite.config.mjs',
  'vite.config.cjs',
];

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function readPackageJson(cwd: string): Record<string, unknown> | null {
  const path = join(cwd, 'package.json');
  const text = readText(path);
  if (!text) return null;
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getDeps(pkg: Record<string, unknown>): Record<string, string> {
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };
  return deps;
}

export function detectFramework(deps: Record<string, string>): Framework {
  if (deps['react'] || deps['@vitejs/plugin-react'] || deps['@vitejs/plugin-react-swc']) {
    return 'react';
  }
  if (deps['vue'] || deps['@vitejs/plugin-vue']) return 'vue';
  if (deps['svelte'] || deps['@sveltejs/vite-plugin-svelte']) return 'svelte';
  if (deps['solid-js'] || deps['vite-plugin-solid']) return 'solid';
  return 'unknown';
}

export function detectProject(cwd: string): ProjectInfo | null {
  const packageJsonPath = join(cwd, 'package.json');
  if (!existsSync(packageJsonPath)) return null;

  const pkg = readPackageJson(cwd);
  if (!pkg) return null;

  const deps = getDeps(pkg);
  const hasVite = Boolean(deps.vite) || existsSync(join(cwd, 'node_modules', 'vite'));
  if (!hasVite) return null;

  const viteConfigPath = findFirstExisting(cwd, VITE_CONFIG_CANDIDATES);
  const framework = detectFramework(deps);

  return {
    cwd,
    packageManager: detectPackageManager(cwd),
    viteConfigPath,
    framework,
    hasReactRouter: Boolean(deps['react-router-dom'] || deps['react-router']),
    hasVueRouter: Boolean(deps['vue-router']),
    packageJsonPath,
  };
}

export function findRouterEntryFiles(cwd: string, framework: Framework): string[] {
  const found: string[] = [];

  if (framework === 'react') {
    const candidates = [
      'src/main.tsx',
      'src/main.ts',
      'src/main.jsx',
      'src/main.js',
      'src/index.tsx',
      'src/index.jsx',
      'src/App.tsx',
      'src/App.jsx',
    ];
    for (const c of candidates) {
      const full = join(cwd, c);
      if (!existsSync(full)) continue;
      const text = readText(full);
      if (text && /<BrowserRouter|createBrowserRouter/.test(text)) {
        found.push(full);
      } else if (/main\.(tsx|ts|jsx|js)$/.test(c)) {
        found.push(full);
      }
    }
  }

  if (framework === 'vue') {
    const routerDirs = ['src/router', 'src/routers'];
    for (const dir of routerDirs) {
      const fullDir = join(cwd, dir);
      if (!existsSync(fullDir)) continue;
      for (const file of readdirSync(fullDir)) {
        if (/\.(ts|js|mts|mjs)$/.test(file)) {
          found.push(join(fullDir, file));
        }
      }
    }
    const rootCandidates = ['src/router.ts', 'src/router.js', 'src/router/index.ts', 'src/router/index.js'];
    for (const c of rootCandidates) {
      const full = join(cwd, c);
      if (existsSync(full)) found.push(full);
    }
  }

  return found;
}

export function installCommand(pm: PackageManager, packages: string[], dev = true): string {
  const flag = dev ? '--save-dev' : '--save';
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${flag} ${packages.join(' ')}`;
    case 'yarn':
      return `yarn add ${dev ? '-D' : ''} ${packages.join(' ')}`.replace(/\s+/g, ' ').trim();
    case 'bun':
      return `bun add ${dev ? '-d' : ''} ${packages.join(' ')}`;
    default:
      return `npm install ${flag} ${packages.join(' ')}`;
  }
}

export function buildCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm run build';
    case 'yarn':
      return 'yarn build';
    case 'bun':
      return 'bun run build';
    default:
      return 'npm run build';
  }
}
