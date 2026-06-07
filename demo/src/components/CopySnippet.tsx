import { useState } from 'react';

type Props = {
  code: string;
};

export function CopySnippet({ code }: Props) {
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
    <div className="copy-snippet">
      <code className="copy-snippet-code">{code}</code>
      <button
        type="button"
        className="copy-snippet-btn"
        onClick={copy}
        aria-label={`Copy: ${code}`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
