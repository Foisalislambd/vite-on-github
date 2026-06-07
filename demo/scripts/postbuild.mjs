/**
 * GitHub Pages: disable Jekyll and serve index.html for unknown paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');

const index = path.join(dist, 'index.html');
const notFound = path.join(dist, '404.html');
const nojekyll = path.join(dist, '.nojekyll');

if (!fs.existsSync(index)) {
  console.error('postbuild: dist/index.html not found — run vite build first');
  process.exit(1);
}

fs.copyFileSync(index, notFound);

const srcNojekyll = path.join(publicDir, '.nojekyll');
if (fs.existsSync(srcNojekyll)) {
  fs.copyFileSync(srcNojekyll, nojekyll);
} else {
  fs.writeFileSync(nojekyll, '');
}

console.log('postbuild: wrote 404.html and .nojekyll for GitHub Pages');
