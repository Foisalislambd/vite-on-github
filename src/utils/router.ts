import { readText, writeText } from './fs.js';
import type { Framework } from './detect.js';

export interface RouterPatchResult {
  file: string;
  changed: boolean;
  message: string;
}

function hasRuntimeImport(content: string): boolean {
  return /from\s+['"]vite-basepath\/runtime['"]/.test(content);
}

function patchReactRouter(content: string): string | null {
  if (content.includes('getBase()') || hasRuntimeImport(content)) {
    return null;
  }

  if (!/<BrowserRouter[\s>/]/.test(content) && !/BrowserRouter\s*\(/.test(content)) {
    return null;
  }

  let updated = content;

  if (!hasRuntimeImport(updated)) {
    const runtimeImport = "import { getBase } from 'vite-basepath/runtime';\n";
    const lastImportEnd = findLastImportEnd(updated);
    updated = updated.slice(0, lastImportEnd) + runtimeImport + updated.slice(lastImportEnd);
  }

  // Replace existing static or dynamic basename props
  updated = updated.replace(
    /<BrowserRouter([^>]*)\s+basename=\{[^}]+\}/g,
    '<BrowserRouter$1 basename={getBase()}',
  );
  updated = updated.replace(
    /<BrowserRouter([^>]*)\s+basename=["'][^"']*["']/g,
    '<BrowserRouter$1 basename={getBase()}',
  );

  // Add basename only when not already set
  updated = updated.replace(
    /<BrowserRouter(?![^>]*\bbasename=)([\s/>])/g,
    '<BrowserRouter basename={getBase()}$1',
  );

  updated = updated.replace(
    /BrowserRouter\s*\(\s*\{/g,
    'BrowserRouter({ basename: getBase(), ',
  );

  return updated !== content ? updated : null;
}

function patchVueRouter(content: string): string | null {
  if (content.includes('getBase()') || hasRuntimeImport(content)) {
    return null;
  }

  if (!/createWebHistory\s*\(/.test(content)) {
    return null;
  }

  let updated = content;

  if (!hasRuntimeImport(updated)) {
    const runtimeImport = "import { getBase } from 'vite-basepath/runtime';\n";
    const lastImportEnd = findLastImportEnd(updated);
    updated = updated.slice(0, lastImportEnd) + runtimeImport + updated.slice(lastImportEnd);
  }

  updated = updated.replace(
    /createWebHistory\s*\(\s*[^)]*\)/g,
    'createWebHistory(getBase())',
  );

  return updated !== content ? updated : null;
}

function findLastImportEnd(content: string): number {
  const importBlock = /^(?:import\s[\s\S]*?from\s+['"][^'"]+['"];|const\s+\w+\s*=\s*require\(['"][^'"]+['"]\);)/gm;
  let lastEnd = 0;
  let match: RegExpExecArray | null;
  while ((match = importBlock.exec(content)) !== null) {
    lastEnd = match.index + match[0].length;
  }
  if (lastEnd > 0) {
    const after = content.slice(lastEnd).match(/^[\r\n]+/);
    return lastEnd + (after ? after[0].length : 0);
  }
  return 0;
}

export function patchRouterFiles(
  files: string[],
  framework: Framework,
): RouterPatchResult[] {
  const results: RouterPatchResult[] = [];

  for (const file of files) {
    const content = readText(file);
    if (!content) continue;

    let patched: string | null = null;

    if (framework === 'react') {
      patched = patchReactRouter(content);
    } else if (framework === 'vue') {
      patched = patchVueRouter(content);
    }

    if (patched) {
      writeText(file, patched);
      results.push({ file, changed: true, message: `Updated router in ${file}` });
    } else if (
      (framework === 'react' && /<BrowserRouter/.test(content)) ||
      (framework === 'vue' && /createWebHistory/.test(content))
    ) {
      results.push({
        file,
        changed: false,
        message: `Router in ${file} already configured or needs manual update`,
      });
    }
  }

  return results;
}
