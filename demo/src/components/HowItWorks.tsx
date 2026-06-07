import { SectionHeader } from './SectionHeader';

const STEPS = [
  {
    title: 'You run the CLI',
    desc: 'npx vite-on-github inside your Vite project folder.',
    icon: '⚡',
  },
  {
    title: 'It configures everything',
    desc: 'vite-basepath, vite.config, router, and GitHub Actions workflow.',
    icon: '🔧',
  },
  {
    title: 'You push',
    desc: 'GitHub Pages deploys on every push to main — any subpath works.',
    icon: '🚀',
  },
] as const;

export function HowItWorks() {
  return (
    <section className="doc-section doc-section-muted">
      <SectionHeader
        id="how-it-works"
        eyebrow="Under the hood"
        title="How it works"
        lead="vite-on-github orchestrates vite-basepath and GitHub Actions — you get a working deploy pipeline in seconds."
      />
      <div className="card-grid card-grid-3">
        {STEPS.map((step) => (
          <article key={step.title} className="icon-card">
            <span className="icon-card-emoji" aria-hidden="true">
              {step.icon}
            </span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
