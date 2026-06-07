import { useEffect, useState } from 'react';
import { getBase } from 'vite-basepath/runtime';

const HOST = 'yoursite.com';

export function PathVisual() {
  const [base, setBase] = useState('/your-app/');

  useEffect(() => {
    const detected = getBase();
    if (detected && detected !== '/') {
      setBase(detected);
    }
  }, []);

  const segments = [
    'https:/',
    '',
    HOST,
    ...base
      .replace(/^\/|\/$/g, '')
      .split('/')
      .filter(Boolean),
  ];

  return (
    <div className="path-visual" aria-hidden="true">
      <div className="browser-chrome">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <div className="browser-url">
          {segments.map((seg, i) => (
            <span
              key={`${seg}-${i}`}
              className={i >= 2 ? 'url-seg url-seg-active' : 'url-seg'}
            >
              {seg}
              {i > 0 && i < segments.length - 1 ? '' : i === 1 ? '' : '/'}
            </span>
          ))}
        </div>
      </div>
      <div className="path-visual-body">
        <div className="path-file">
          <span className="path-file-icon">📄</span>
          <span>index.html</span>
        </div>
        <div className="path-arrow">↓</div>
        <div className="path-file path-file-asset">
          <span className="path-file-icon">⚡</span>
          <span>./assets/index.js</span>
          <span className="path-badge">loads OK</span>
        </div>
      </div>
    </div>
  );
}
