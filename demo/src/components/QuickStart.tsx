import { SITE } from '../data/site';
import { SectionHeader } from './SectionHeader';
import { CodeBlock } from './CodeBlock';

export function QuickStart() {
  return (
    <section className="doc-section">
      <SectionHeader
        id="install"
        eyebrow="Quick start"
        title="One command. Everything configured."
        lead="Run inside any Vite project folder. No manual vite.config edits, no YAML from scratch."
      />
      <div className="steps-cards">
        <div className="step-card">
          <span className="step-card-num">01</span>
          <h3>Run the CLI</h3>
          <p className="step-card-lead">
            From your Vite project root — interactive prompts, or skip them with{' '}
            <code>-y</code>:
          </p>
          <CodeBlock title="terminal" lang="bash" code={`npx ${SITE.npm}`} />
          <CodeBlock
            title="non-interactive"
            lang="bash"
            code={`npx ${SITE.npm} init -y`}
          />
        </div>
        <div className="step-card step-card-vite">
          <span className="step-card-num">02</span>
          <h3>What it sets up automatically</h3>
          <p className="step-card-lead">
            {SITE.title} installs <strong>vite-basepath</strong>, patches your Vite config,
            updates React/Vue Router when detected, and creates a GitHub Actions workflow.
          </p>
          <CodeBlock
            lang="ts"
            title="vite.config.ts (auto-patched)"
            code={`import viteBasepath from 'vite-basepath';

export default defineConfig({
  plugins: [react(), viteBasepath()],
});`}
            highlightLines={[
              { line: 1, label: 'Added' },
              { line: 4, label: 'Added' },
            ]}
          />
        </div>
        <div className="step-card">
          <span className="step-card-num">03</span>
          <h3>Push & deploy</h3>
          <CodeBlock
            code={`git push origin main
# Settings → Pages → Source: GitHub Actions`}
          />
        </div>
      </div>
      <aside className="tip-card">
        <strong>Already have a workflow?</strong>
        <p>
          Re-running is safe — the CLI skips steps that are already done. Use{' '}
          <code>--skip-ci</code> or <code>--skip-router</code> to customize.
        </p>
      </aside>
    </section>
  );
}
