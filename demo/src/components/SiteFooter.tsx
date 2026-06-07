import { SITE } from '../data/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{SITE.title}</p>
          <p className="footer-tagline">Vite → GitHub Pages in one command.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href={SITE.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={SITE.npmUrl} target="_blank" rel="noopener noreferrer">
            npm
          </a>
          <a href={SITE.basepathNpm} target="_blank" rel="noopener noreferrer">
            vite-basepath
          </a>
          <a href="#install">Docs</a>
        </nav>
      </div>
      <p className="footer-copy">
        MIT © {new Date().getFullYear()} · Built with Vite + React · Deployed on GitHub
        Pages using vite-basepath
      </p>
    </footer>
  );
}
