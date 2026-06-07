import { useState } from 'react';

export type HighlightLine = {
  line: number;
  label?: string;
};

type Props = {
  code: string;
  lang?: string;
  title?: string;
  /** 1-based line numbers to emphasize (e.g. plugin import + registration) */
  highlightLines?: HighlightLine[];
};

export function CodeBlock({ code, lang = 'bash', title, highlightLines }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="code-panel">
      <div className="code-panel-bar">
        <div className="code-dots" aria-hidden="true">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="code-panel-title">{title ?? lang}</span>
        <button type="button" className="code-copy" onClick={copy} aria-label="Copy code">
          {copied ? (
            <>
              <CheckIcon /> Copied
            </>
          ) : (
            <>
              <CopyIcon /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="code-panel-body">
        <code>
          {highlightLines?.length
            ? code.split('\n').map((line, index) => {
                const lineNum = index + 1;
                const mark = highlightLines.find((h) => h.line === lineNum);
                return (
                  <span
                    key={lineNum}
                    className={mark ? 'code-line code-line-highlight' : 'code-line'}
                  >
                    {mark?.label ? (
                      <span className="code-line-tag">{mark.label}</span>
                    ) : null}
                    <span className="code-line-text">{line || ' '}</span>
                  </span>
                );
              })
            : code}
        </code>
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
