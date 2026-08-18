// @ts-nocheck
import { useState } from 'react';
import { ModusWcButton, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

export const NESTED_HTML_CODE_SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login Screen</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f0f0f0;
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
      margin: 0;
    }
  </style>
</head>
<body>
  <main class="login">
    <!-- Login form -->
  </main>
</body>
</html>`;

/** Dark-chrome code block with language label and clipboard copy button. */
export function CodePattern({ caption = 'HTML' }: { caption?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(NESTED_HTML_CODE_SAMPLE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)]">
      <div className="flex items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.1)] bg-[#282c34] px-3 py-2">
        <span className="font-mono text-sm font-semibold text-[rgba(255,255,255,0.8)]">
          {caption}
        </span>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          size="sm"
          aria-label={copied ? 'Code copied' : 'Copy code'}
          onButtonClick={() => void handleCopy()}
        >
          {copied ? (
            <ModusWcIcon name="check_circle" size="sm" decorative />
          ) : (
            <ModusWcIcon name="copy_content" size="sm" decorative />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </ModusWcButton>
      </div>
      <pre className="m-0 overflow-x-auto bg-[#282c34] p-4 text-sm leading-relaxed text-[#abb2bf]">
        <code>{NESTED_HTML_CODE_SAMPLE}</code>
      </pre>
    </div>
  );
}

export default CodePattern;
