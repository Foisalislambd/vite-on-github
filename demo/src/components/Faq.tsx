import { useState } from 'react';
import { SITE } from '../data/site';
import { SectionHeader } from './SectionHeader';

const FAQ = [
  {
    q: 'Do I still need vite-basepath?',
    a: `${SITE.title} installs and configures vite-basepath for you. It handles relative base paths and runtime detection — the CLI just automates the setup.`,
  },
  {
    q: 'Will it overwrite my vite.config?',
    a: 'It patches your config — adds the import and plugin. Existing plugins and options stay intact. Safe to run again.',
  },
  {
    q: 'Does it work with React, Vue, and Svelte?',
    a: 'Yes. Any Vite project works. React Router and Vue Router are auto-patched when detected.',
  },
  {
    q: 'Do I need base: "/repo-name/" for GitHub Pages?',
    a: 'No. vite-basepath uses ./ builds. getBase() returns the real deploy path at runtime — e.g. /vite-on-github/ on this site.',
  },
  {
    q: 'Can I use only part of the setup?',
    a: 'Yes. Use --skip-ci, --skip-router, or --skip-vite-config to run only the steps you need.',
  },
  {
    q: 'What if I already have a deploy workflow?',
    a: 'Use --skip-ci to avoid overwriting. Or review the generated deploy.yml and merge manually.',
  },
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="doc-section doc-section-muted">
      <SectionHeader id="faq" eyebrow="FAQ" title="Common questions" />
      <div className="accordion">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={isOpen ? 'accordion-item is-open' : 'accordion-item'}
            >
              <button
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="accordion-chevron" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen ? <div className="accordion-panel">{item.a}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
