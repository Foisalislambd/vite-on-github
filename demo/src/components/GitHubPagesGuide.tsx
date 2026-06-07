import { SITE } from '../data/site';
import { SectionHeader } from './SectionHeader';
import { CodeBlock } from './CodeBlock';

export function GitHubPagesGuide() {
  return (
    <section className="doc-section doc-section-muted">
      <SectionHeader
        id="github-pages"
        eyebrow="GitHub Pages"
        title="Deploy to GitHub Pages"
        lead="This site is the proof — built from /demo and deployed with the same workflow the CLI generates."
      />
      <div className="gh-steps">
        <div className="gh-step">
          <span>1</span>
          <p>
            Run <code>npx {SITE.npm}</code> in your Vite project.
          </p>
        </div>
        <div className="gh-step">
          <span>2</span>
          <p>
            Push to GitHub. Enable <strong>Settings → Pages → GitHub Actions</strong> as the
            source.
          </p>
        </div>
        <div className="gh-step">
          <span>3</span>
          <p>
            Your site goes live at{' '}
            <a href={SITE.liveUrl} className="text-link">
              {SITE.liveUrl}
            </a>{' '}
            — works at root or <code>/repo-name/</code> without changing config.
          </p>
        </div>
      </div>
      <div className="tip-card tip-card-success">
        <strong>Powered by vite-basepath</strong>
        <p>
          Base paths use relative <code>./</code> builds. Runtime detection returns{' '}
          <code>{SITE.pagesPath}</code> automatically — no hard-coded{' '}
          <code>base: '/repo-name/'</code>.
        </p>
      </div>
      <CodeBlock
        title=".github/workflows/deploy.yml (auto-generated)"
        lang="yaml"
        code={`on:
  push:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: cp dist/index.html dist/404.html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    uses: actions/deploy-pages@v4`}
      />
    </section>
  );
}
