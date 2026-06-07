import { patchRouterFiles, patchViteConfig } from '../dist/index.js';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const tmp = join(process.cwd(), '.test-tmp');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

function read(p) {
  return readFileSync(p, 'utf8');
}

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    console.log(`✔ ${name}`);
    passed++;
  } else {
    console.log(`✖ ${name}`);
    failed++;
  }
}

// Test 1: React router without basename
const react1 = `import { BrowserRouter } from 'react-router-dom';\nexport default <BrowserRouter><App/></BrowserRouter>;\n`;
const react1Path = join(tmp, 'main.tsx');
writeFileSync(react1Path, react1);
patchRouterFiles([react1Path], 'react');
assert('React adds basename', read(react1Path).includes('basename={getBase()}'));

// Test 2: React router with existing basename — replace, not duplicate
const react2 = `import { BrowserRouter } from 'react-router-dom';\nexport default <BrowserRouter basename="/old"><App/></BrowserRouter>;\n`;
const react2Path = join(tmp, 'main2.tsx');
writeFileSync(react2Path, react2);
patchRouterFiles([react2Path], 'react');
const out2 = read(react2Path);
assert('React replaces basename', out2.includes('basename={getBase()}'));
assert('React no duplicate basename', (out2.match(/basename/g) || []).length === 1);

// Test 3: Vue router
const vue1 = `import { createWebHistory } from 'vue-router';\nexport const history = createWebHistory('/app');\n`;
const vuePath = join(tmp, 'router.ts');
writeFileSync(vuePath, vue1);
patchRouterFiles([vuePath], 'vue');
assert('Vue history patched', read(vuePath).includes('createWebHistory(getBase())'));

// Test 4: multiline vite config import
const viteCfg = `import {\n  defineConfig\n} from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n});\n`;
const vitePath = join(tmp, 'vite.config.ts');
writeFileSync(vitePath, viteCfg);
patchViteConfig(vitePath);
const cfg = read(vitePath);
assert('Vite import after existing imports', cfg.indexOf("vite-basepath") > cfg.indexOf('defineConfig'));
assert('Vite plugin added', cfg.includes('viteBasepath()'));

// Test 5: idempotent — running again should not duplicate
patchViteConfig(vitePath);
assert('Vite patch idempotent', (read(vitePath).match(/viteBasepath\(\)/g) || []).length === 1);

rmSync(tmp, { recursive: true, force: true });

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
