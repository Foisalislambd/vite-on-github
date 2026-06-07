import { SITE } from '../data/site';
import { SectionHeader } from './SectionHeader';
import { CodeBlock } from './CodeBlock';

export function RouterGuide() {
  return (
    <section className="doc-section">
      <SectionHeader
        id="router"
        eyebrow="Routers"
        title="Client-side routing"
        lead={`${SITE.title} auto-patches React Router and Vue Router when detected. Or add getBase() manually.`}
      />
      <div className="card-grid card-grid-2">
        <div>
          <h3 className="subsection-title">React Router (auto-patched)</h3>
          <CodeBlock
            lang="tsx"
            title="main.tsx"
            code={`import { BrowserRouter } from 'react-router-dom';
import { getBase } from 'vite-basepath/runtime';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={getBase()}>
    <App />
  </BrowserRouter>,
);`}
          />
        </div>
        <div>
          <h3 className="subsection-title">Vue Router (auto-patched)</h3>
          <CodeBlock
            lang="ts"
            title="router/index.ts"
            code={`import { createRouter, createWebHistory } from 'vue-router';
import { getBase } from 'vite-basepath/runtime';

export default createRouter({
  history: createWebHistory(getBase()),
  routes: [/* ... */],
});`}
          />
        </div>
      </div>
      <aside className="tip-card">
        <strong>Skip router patching?</strong>
        <p>
          Run <code>npx {SITE.npm} init --skip-router</code> if you prefer to configure
          manually.
        </p>
      </aside>
    </section>
  );
}
