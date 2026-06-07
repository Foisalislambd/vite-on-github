import { SITE } from '../data/site';
import { SectionHeader } from './SectionHeader';
import { CodeBlock } from './CodeBlock';

export function ApiReference() {
  return (
    <section className="doc-section">
      <SectionHeader
        id="api"
        eyebrow="Reference"
        title="CLI & programmatic API"
        lead="Use from the terminal or import in scripts. TypeScript types ship with the package."
      />
      <h3 className="subsection-title">CLI options</h3>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>-y, --yes</code>
              </td>
              <td>Skip prompts, use defaults</td>
            </tr>
            <tr>
              <td>
                <code>--skip-install</code>
              </td>
              <td>Do not install vite-basepath</td>
            </tr>
            <tr>
              <td>
                <code>--skip-vite-config</code>
              </td>
              <td>Do not patch vite.config</td>
            </tr>
            <tr>
              <td>
                <code>--skip-router</code>
              </td>
              <td>Do not patch React/Vue router</td>
            </tr>
            <tr>
              <td>
                <code>--skip-ci</code>
              </td>
              <td>Do not create GitHub Actions workflow</td>
            </tr>
            <tr>
              <td>
                <code>--node &lt;version&gt;</code>
              </td>
              <td>Node.js version for CI (default: 22)</td>
            </tr>
            <tr>
              <td>
                <code>--out-dir &lt;dir&gt;</code>
              </td>
              <td>Build output directory (default: dist)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="subsection-title">Programmatic API</h3>
      <CodeBlock
        lang="ts"
        code={`import { init } from '${SITE.npm}';

const result = await init({
  cwd: '/path/to/vite-project',
  yes: true,
});

console.log(result.pagesUrl);
console.log(result.steps);
console.log(result.warnings);`}
      />
      <h3 className="subsection-title">Exports</h3>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>Export</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>init()</code>
              </td>
              <td>Run full setup pipeline</td>
            </tr>
            <tr>
              <td>
                <code>detectProject()</code>
              </td>
              <td>Detect Vite project, framework, package manager</td>
            </tr>
            <tr>
              <td>
                <code>patchViteConfig()</code>
              </td>
              <td>Add viteBasepath() to vite.config</td>
            </tr>
            <tr>
              <td>
                <code>writeWorkflow()</code>
              </td>
              <td>Generate GitHub Actions deploy workflow</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
