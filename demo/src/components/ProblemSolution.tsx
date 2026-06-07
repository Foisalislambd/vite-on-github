import { SITE } from '../data/site';
import { SectionHeader } from './SectionHeader';

export function ProblemSolution() {
  return (
    <>
      <section className="doc-section">
        <SectionHeader
          id="problem"
          eyebrow="Why it matters"
          title="GitHub Pages setup is tedious"
          lead="Vite apps need correct base paths, router basename, SPA fallback, and a CI workflow — easy to get wrong."
        />
        <div className="card-grid card-grid-2">
          <article className="feature-card feature-card-warn">
            <div className="feature-icon feature-icon-warn" aria-hidden="true">
              ✕
            </div>
            <h3>Manual setup</h3>
            <p className="feature-code">
              <code>base: '/repo/'</code> · YAML · 404.html · router basename
            </p>
            <ul>
              <li>Breaks when you move folders</li>
              <li>Hours of docs and trial-and-error</li>
            </ul>
          </article>
          <article className="feature-card feature-card-ok">
            <div className="feature-icon feature-icon-ok" aria-hidden="true">
              ✓
            </div>
            <h3>
              With <code>{SITE.npm}</code>
            </h3>
            <p className="feature-code">
              <code>npx {SITE.npm}</code>
            </p>
            <ul>
              <li>Auto config + vite-basepath</li>
              <li>CI workflow created for you</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="doc-section doc-section-muted">
        <SectionHeader
          id="solution"
          eyebrow="What it does"
          title="Five steps, fully automatic"
          lead="One command handles install, Vite config, router patching, and GitHub Actions."
        />
        <ol className="timeline">
          <li className="timeline-item">
            <span className="timeline-num">1</span>
            <div>
              <h3>Install vite-basepath</h3>
              <p>
                Adds the plugin that sets <code>base: './'</code> for subdirectory-safe
                builds.
              </p>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-num">2</span>
            <div>
              <h3>Patch vite.config</h3>
              <p>
                Inserts <code>viteBasepath()</code> into your plugins array — no manual
                editing.
              </p>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-num">3</span>
            <div>
              <h3>Configure router</h3>
              <p>
                Detects React Router / Vue Router and adds <code>getBase()</code>{' '}
                automatically.
              </p>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-num">4</span>
            <div>
              <h3>Create CI workflow</h3>
              <p>
                Writes <code>.github/workflows/deploy.yml</code> for GitHub Pages with SPA
                fallback.
              </p>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-num">5</span>
            <div>
              <h3>Push and deploy</h3>
              <p>
                Enable GitHub Actions as Pages source — your app lives at paths like{' '}
                <code>{SITE.pagesPath}</code>.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </>
  );
}
