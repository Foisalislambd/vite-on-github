import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { SiteHeader } from './SiteHeader';

type Props = {
  children: React.ReactNode;
};

const SECTION_IDS = [
  'hero',
  'problem',
  'solution',
  'install',
  'how-it-works',
  'router',
  'github-pages',
  'api',
  'faq',
];

export function Layout({ children }: Props) {
  const [activeId, setActiveId] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <>
      <div className="docs-shell">
        <div className="sidebar-desktop">
          <Sidebar activeId={activeId} />
        </div>
        <div className="docs-main">
          <SiteHeader
            menuOpen={sidebarOpen}
            onMenuToggle={() => setSidebarOpen((open) => !open)}
          />
          <div className="docs-content">{children}</div>
        </div>
      </div>
      <div
        className={sidebarOpen ? 'sidebar-backdrop is-open' : 'sidebar-backdrop'}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className={sidebarOpen ? 'sidebar-drawer is-open' : 'sidebar-drawer'}>
        <Sidebar activeId={activeId} onNavigate={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
