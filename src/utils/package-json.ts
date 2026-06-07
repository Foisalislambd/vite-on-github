import { readText, writeText } from './fs.js';

export interface PackageJson {
  name?: string;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
}

export function readPackageJson(path: string): PackageJson | null {
  const text = readText(path);
  if (!text) return null;
  try {
    return JSON.parse(text) as PackageJson;
  } catch {
    return null;
  }
}

export function writePackageJson(path: string, pkg: PackageJson): void {
  writeText(path, `${JSON.stringify(pkg, null, 2)}\n`);
}

export function ensureBuildScript(pkg: PackageJson): boolean {
  if (!pkg.scripts) pkg.scripts = {};
  if (pkg.scripts.build) return false;
  pkg.scripts.build = 'vite build';
  return true;
}

export function hasDevDependency(pkg: PackageJson, name: string): boolean {
  return Boolean(pkg.devDependencies?.[name] || pkg.dependencies?.[name]);
}
