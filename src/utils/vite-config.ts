import { readText, writeText } from './fs.js';

export interface ViteConfigPatchResult {
  changed: boolean;
  message: string;
}

function hasViteBasepathImport(content: string): boolean {
  return /from\s+['"]vite-basepath['"]/.test(content) || /require\s*\(\s*['"]vite-basepath['"]\s*\)/.test(content);
}

function hasViteBasepathPlugin(content: string): boolean {
  return /viteBasepath\s*\(/.test(content);
}

function isCommonJsConfig(path: string): boolean {
  return /\.cjs$/.test(path);
}

function addImport(content: string, configPath: string): string {
  if (hasViteBasepathImport(content)) return content;

  const importLine = isCommonJsConfig(configPath)
    ? "const viteBasepath = require('vite-basepath');\n"
    : "import viteBasepath from 'vite-basepath';\n";

  const importMatch = content.match(/^import .+?;[\r\n]/m) ?? content.match(/^const .+ = require\(.+?\);[\r\n]/m);
  if (importMatch && importMatch.index !== undefined) {
    const lastImportEnd = findLastImportEnd(content);
    return content.slice(0, lastImportEnd) + importLine + content.slice(lastImportEnd);
  }

  return importLine + content;
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

function addPluginToArray(content: string): string {
  const pluginsArrayMatch = content.match(/plugins\s*:\s*\[/);
  if (pluginsArrayMatch && pluginsArrayMatch.index !== undefined) {
    const bracketIndex = content.indexOf('[', pluginsArrayMatch.index);
    const insertAt = bracketIndex + 1;
    const afterBracket = content.slice(insertAt).match(/^\s*\n?/);
    const gap = afterBracket ? afterBracket[0] : '\n    ';
    return (
      content.slice(0, insertAt) +
      `${gap}viteBasepath(), ` +
      content.slice(insertAt)
    );
  }

  const defineConfigMatch = content.match(/defineConfig\s*\(\s*\{/);
  if (defineConfigMatch && defineConfigMatch.index !== undefined) {
    const braceIndex = content.indexOf('{', defineConfigMatch.index);
    const insertAt = braceIndex + 1;
    return (
      content.slice(0, insertAt) +
      '\n  plugins: [viteBasepath()],' +
      content.slice(insertAt)
    );
  }

  const exportDefaultMatch = content.match(/export\s+default\s*\{/);
  if (exportDefaultMatch && exportDefaultMatch.index !== undefined) {
    const braceIndex = content.indexOf('{', exportDefaultMatch.index);
    const insertAt = braceIndex + 1;
    return (
      content.slice(0, insertAt) +
      '\n  plugins: [viteBasepath()],' +
      content.slice(insertAt)
    );
  }

  return content;
}

export function patchViteConfig(configPath: string): ViteConfigPatchResult {
  const content = readText(configPath);
  if (!content) {
    return { changed: false, message: `Could not read ${configPath}` };
  }

  if (hasViteBasepathPlugin(content)) {
    return { changed: false, message: 'vite-basepath already configured in vite config' };
  }

  let updated = addImport(content, configPath);
  updated = addPluginToArray(updated);

  if (updated === content) {
    return {
      changed: false,
      message:
        'Could not auto-patch vite config — add viteBasepath() to plugins manually',
    };
  }

  writeText(configPath, updated);
  return { changed: true, message: `Updated ${configPath}` };
}

function frameworkPluginImport(framework: string): { importLine: string; pluginCall: string } | null {
  switch (framework) {
    case 'react':
      return {
        importLine: "import react from '@vitejs/plugin-react';\n",
        pluginCall: 'react()',
      };
    case 'vue':
      return {
        importLine: "import vue from '@vitejs/plugin-vue';\n",
        pluginCall: 'vue()',
      };
    case 'svelte':
      return {
        importLine: "import { svelte } from '@sveltejs/vite-plugin-svelte';\n",
        pluginCall: 'svelte()',
      };
    case 'solid':
      return {
        importLine: "import solid from 'vite-plugin-solid';\n",
        pluginCall: 'solid()',
      };
    default:
      return null;
  }
}

export function createDefaultViteConfig(
  cwd: string,
  isTs: boolean,
  framework = 'unknown',
): string {
  const filename = isTs ? 'vite.config.ts' : 'vite.config.js';
  const path = `${cwd}/${filename}`.replace(/\\/g, '/');
  const fw = frameworkPluginImport(framework);
  const plugins = fw ? `viteBasepath(), ${fw.pluginCall}` : 'viteBasepath()';
  const content = `import { defineConfig } from 'vite';
import viteBasepath from 'vite-basepath';
${fw?.importLine ?? ''}
export default defineConfig({
  plugins: [${plugins}],
});
`;

  writeText(path, content);
  return path;
}
