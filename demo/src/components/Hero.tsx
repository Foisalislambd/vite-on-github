import { useEffect, useState } from 'react';
import { getBase, getAbsoluteBase } from 'vite-basepath/runtime';
import { SITE } from '../data/site';
import { CodeBlock } from './CodeBlock';
import { PathVisual } from './PathVisual';

export function Hero() {
  const [base, setBase] = useState('…');
  const [absolute, setAbsolute] = useState('…');

  useEffect(() => {
    setBase(getBase());
    setAbsolute(getAbsoluteBase());
  }, []);

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-pills">
            <span className="pill">Vite 3 – 8</span>
            <span className="pill pill-accent">MIT</span>
            <span className="pill">One command</span>
          </div>
          <h1 id="hero-title">
            Vite to GitHub Pages.
            <br />
            <span className="hero-highlight">Fully automatic.</span>
          </h1>
          <p className="hero-lead">
            {SITE.tagline} Installs vite-basepath, patches your config, sets up CI, and
            fixes router basename — push and deploy.
          </p>
          <div className="hero-actions">
            <a href="#install" className="btn btn-primary">
              Get started
              <span aria-hidden="true">→</span>
            </a>
            <a
              href={SITE.npmUrl}
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm package
            </a>
          </div>
          <div className="hero-install">
            <CodeBlock title="install" lang="bash" code={`npx ${SITE.npm}`} />
          </div>
        </div>
        <div className="hero-aside">
          <PathVisual />
          <div className="live-card">
            <div className="live-card-head">
              <span className="live-pulse" />
              Live detection (vite-basepath)
            </div>
            <dl className="live-dl">
              <div>
                <dt>getBase()</dt>
                <dd>
                  <code>{base}</code>
                </dd>
              </div>
              <div>
                <dt>getAbsoluteBase()</dt>
                <dd>
                  <code className="code-sm">{absolute}</code>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
