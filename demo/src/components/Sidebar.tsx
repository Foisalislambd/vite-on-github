import { NAV, SITE } from '../data/site';

type Props = {
  activeId: string;
  onNavigate?: () => void;
};

export function Sidebar({ activeId, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <a href="#" className="sidebar-logo" onClick={onNavigate}>
        <span className="sidebar-logo-icon" aria-hidden="true" />
        <span>
          <strong>{SITE.title}</strong>
          <small>v{SITE.version}</small>
        </span>
      </a>
      <nav className="sidebar-nav" aria-label="On this page">
        <p className="sidebar-label">On this page</p>
        <ul>
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={
                  activeId === item.id ? 'sidebar-link is-active' : 'sidebar-link'
                }
                onClick={onNavigate}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <a
          href={SITE.npmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-cta"
        >
          Install on npm
        </a>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link-muted"
        >
          View source →
        </a>
      </div>
    </aside>
  );
}
